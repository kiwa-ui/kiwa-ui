export type Bindings = {
  DB: D1Database
  CACHE?: KVNamespace
  ENVIRONMENT?: string
  LEMON_SQUEEZY_WEBHOOK_SECRET?: string
  LEMON_SQUEEZY_API_KEY?: string
  LEMON_SQUEEZY_PRO_VARIANT_ID?: string
  RESEND_API_KEY?: string
}

export type License = {
  key: string
  email: string
  tier: string
}

export type Variables = {
  license: License
}
