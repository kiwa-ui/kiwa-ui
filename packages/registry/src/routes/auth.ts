import { Hono } from 'hono'
import { sendWelcomeEmail } from '../lib/email'
import {
  findActiveLicenseByEmail,
  findLicenseByKey,
  findLicenseByOrderId,
  generateLicenseKey,
  insertLicense,
  revokeLicenseByOrderId,
} from '../lib/license'
import { verifyLemonSqueezySignature } from '../lib/signature'
import type { Bindings, Variables } from '../types'

const auth = new Hono<{ Bindings: Bindings; Variables: Variables }>()

const RESEND_COOLDOWN_SECONDS = 60
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

auth.post('/resend-key', async (c) => {
  const body = await c.req.json<{ email?: string }>().catch(() => ({}) as { email?: string })
  const email = body.email?.trim().toLowerCase()

  // Always return the same generic response to prevent enumeration of which
  // emails correspond to a license. The actual send is best-effort.
  const genericResponse = {
    ok: true,
    message:
      'If this email is associated with a Kiwa UI Pro license, a new email has been sent.',
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    return c.json(genericResponse)
  }
  if (!c.env.DB) {
    return c.json(genericResponse)
  }

  // Per-email cooldown via KV. Skip silently if a recent resend was issued.
  if (c.env.CACHE) {
    const cooldownKey = `resend:${email}`
    const recent = await c.env.CACHE.get(cooldownKey)
    if (recent) {
      return c.json(genericResponse)
    }
    await c.env.CACHE.put(cooldownKey, '1', {
      expirationTtl: RESEND_COOLDOWN_SECONDS,
    })
  }

  const license = await findActiveLicenseByEmail(c.env.DB, email)
  if (!license || !license.lemon_order_id) {
    return c.json(genericResponse)
  }

  if (c.env.RESEND_API_KEY) {
    try {
      await sendWelcomeEmail({
        apiKey: c.env.RESEND_API_KEY,
        to: license.email,
        licenseKey: license.key,
        orderId: license.lemon_order_id,
      })
    } catch (err) {
      console.error('Failed to resend welcome email', {
        email,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  } else {
    console.warn('RESEND_API_KEY not set — cannot resend welcome email', { email })
  }

  return c.json(genericResponse)
})

auth.post('/validate', async (c) => {
  const body = await c.req.json<{ key?: string }>().catch(() => ({}) as { key?: string })
  const key = body.key?.trim()

  if (!key) {
    return c.json({ valid: false, error: 'Missing license key' }, 400)
  }
  if (!c.env.DB) {
    return c.json({ valid: false, error: 'Registry misconfigured' }, 500)
  }

  const license = await findLicenseByKey(c.env.DB, key)
  if (!license || license.revoked_at) {
    return c.json({ valid: false, error: 'Invalid license key' }, 401)
  }

  return c.json({ valid: true, tier: license.tier, expiresAt: null })
})

auth.post('/webhook/lemon-squeezy', async (c) => {
  const secret = c.env.LEMON_SQUEEZY_WEBHOOK_SECRET
  if (!secret) {
    return c.json({ error: 'Webhook secret not configured' }, 500)
  }
  if (!c.env.DB) {
    return c.json({ error: 'Registry misconfigured (no database bound)' }, 500)
  }

  const signature = c.req.header('X-Signature')
  const rawBody = await c.req.text()

  const signatureValid = await verifyLemonSqueezySignature(rawBody, signature, secret)
  if (!signatureValid) {
    return c.json({ error: 'Invalid signature' }, 401)
  }

  let payload: LemonSqueezyWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }

  const eventName = payload?.meta?.event_name

  if (eventName === 'order_created') {
    const order = payload.data
    const orderId = order?.id
    const attrs = order?.attributes
    const firstItem = attrs?.first_order_item
    const variantId = firstItem?.variant_id != null ? String(firstItem.variant_id) : undefined
    const email = attrs?.user_email

    if (!orderId || !variantId || !email) {
      return c.json({ error: 'Payload missing required order fields' }, 400)
    }

    const tier = resolveTier(variantId, c.env)
    if (!tier) {
      return c.json({ error: `Unknown variant id: ${variantId}` }, 400)
    }

    const existing = await findLicenseByOrderId(c.env.DB, orderId)
    if (existing) {
      return c.json({ received: true, duplicate: true, orderId })
    }

    const licenseKey = generateLicenseKey()
    const { inserted } = await insertLicense(c.env.DB, {
      key: licenseKey,
      email,
      tier,
      lemonOrderId: orderId,
      lemonVariantId: variantId,
    })

    if (!inserted) {
      return c.json({ received: true, duplicate: true, orderId })
    }

    if (c.env.RESEND_API_KEY) {
      try {
        await sendWelcomeEmail({
          apiKey: c.env.RESEND_API_KEY,
          to: email,
          licenseKey,
          orderId,
        })
      } catch (err) {
        console.error('Failed to send welcome email', {
          orderId,
          error: err instanceof Error ? err.message : String(err),
        })
      }
    } else {
      console.warn('RESEND_API_KEY not set — skipping welcome email', { orderId })
    }

    return c.json({ received: true, orderId })
  }

  if (eventName === 'order_refunded') {
    const order = payload.data
    const orderId = order?.id
    const attrs = order?.attributes

    if (!orderId) {
      return c.json({ error: 'Payload missing order id' }, 400)
    }

    // LS fires order_refunded for both partial and full refunds. Only revoke
    // on a full refund (attributes.refunded === true). Partial refunds leave
    // the license valid since the customer still has paid access.
    if (attrs?.refunded !== true) {
      return c.json({ received: true, partialRefund: true, orderId })
    }

    const result = await revokeLicenseByOrderId(c.env.DB, orderId)
    return c.json({ received: true, orderId, ...result })
  }

  return c.json({ received: true, ignored: eventName ?? 'unknown' })
})

function resolveTier(variantId: string, env: Bindings): string | null {
  if (env.LEMON_SQUEEZY_PRO_VARIANT_ID && variantId === env.LEMON_SQUEEZY_PRO_VARIANT_ID) {
    return 'pro'
  }
  return null
}

type LemonSqueezyWebhookPayload = {
  meta?: {
    event_name?: string
    custom_data?: Record<string, unknown>
  }
  data?: {
    id?: string
    type?: string
    attributes?: {
      user_email?: string
      user_name?: string
      refunded?: boolean
      first_order_item?: {
        variant_id?: number | string
        product_id?: number | string
      }
    }
  }
}

export { auth }
