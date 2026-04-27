import type { Context, Next } from 'hono'
import { findLicenseByKey } from '../lib/license'
import type { Bindings, License, Variables } from '../types'

type AuthResult =
  | { ok: true; license: License }
  | { ok: false; status: 401 | 500; error: string }

export async function checkLicenseHeader(
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
): Promise<AuthResult> {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { ok: false, status: 401, error: 'Unauthorized - License key required' }
  }

  const token = authHeader.slice(7).trim()
  if (!token) {
    return { ok: false, status: 401, error: 'Invalid license key' }
  }

  if (!c.env.DB) {
    return { ok: false, status: 500, error: 'Registry misconfigured (no database bound)' }
  }

  const license = await findLicenseByKey(c.env.DB, token)
  if (!license) {
    return { ok: false, status: 401, error: 'Invalid license key' }
  }
  if (license.revoked_at) {
    return { ok: false, status: 401, error: 'License revoked' }
  }

  return {
    ok: true,
    license: { key: license.key, email: license.email, tier: license.tier },
  }
}

export async function requirePaidLicense(
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
  next: Next,
) {
  const result = await checkLicenseHeader(c)
  if (!result.ok) {
    return c.json({ error: result.error }, result.status)
  }
  c.set('license', result.license)
  await next()
}
