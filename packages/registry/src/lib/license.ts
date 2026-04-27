const KEY_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const KEY_LENGTH = 32

export function generateLicenseKey(): string {
  const bytes = new Uint8Array(KEY_LENGTH)
  crypto.getRandomValues(bytes)
  let out = 'hui_live_'
  for (const byte of bytes) out += KEY_ALPHABET[byte % KEY_ALPHABET.length]
  return out
}

export type LicenseRow = {
  key: string
  email: string
  tier: string
  lemon_order_id: string | null
  lemon_variant_id: string | null
  created_at: number
  revoked_at: number | null
}

export async function insertLicense(
  db: D1Database,
  row: {
    key: string
    email: string
    tier: string
    lemonOrderId: string
    lemonVariantId: string
  },
): Promise<{ inserted: boolean }> {
  try {
    await db
      .prepare(
        `INSERT INTO licenses (key, email, tier, lemon_order_id, lemon_variant_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(row.key, row.email, row.tier, row.lemonOrderId, row.lemonVariantId, Date.now())
      .run()
    return { inserted: true }
  } catch (err) {
    if (err instanceof Error && /UNIQUE constraint failed/i.test(err.message)) {
      return { inserted: false }
    }
    throw err
  }
}

export async function findLicenseByOrderId(
  db: D1Database,
  orderId: string,
): Promise<LicenseRow | null> {
  return await db
    .prepare('SELECT * FROM licenses WHERE lemon_order_id = ?')
    .bind(orderId)
    .first<LicenseRow>()
}

export async function findLicenseByKey(
  db: D1Database,
  key: string,
): Promise<LicenseRow | null> {
  return await db
    .prepare('SELECT * FROM licenses WHERE key = ?')
    .bind(key)
    .first<LicenseRow>()
}

export async function findActiveLicenseByEmail(
  db: D1Database,
  email: string,
): Promise<LicenseRow | null> {
  return await db
    .prepare(
      `SELECT * FROM licenses
       WHERE email = ? AND revoked_at IS NULL
       ORDER BY created_at DESC
       LIMIT 1`,
    )
    .bind(email)
    .first<LicenseRow>()
}

export async function revokeLicenseByOrderId(
  db: D1Database,
  orderId: string,
): Promise<{ revoked: boolean; alreadyRevoked: boolean; notFound: boolean }> {
  const existing = await findLicenseByOrderId(db, orderId)
  if (!existing) return { revoked: false, alreadyRevoked: false, notFound: true }
  if (existing.revoked_at) return { revoked: false, alreadyRevoked: true, notFound: false }
  await db
    .prepare('UPDATE licenses SET revoked_at = ? WHERE lemon_order_id = ?')
    .bind(Date.now(), orderId)
    .run()
  return { revoked: true, alreadyRevoked: false, notFound: false }
}
