export type Bindings = {
  USERS_KV: KVNamespace
  STRIPE_SECRET_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string
  GEMINI_API_KEY?: string
}

export type AppEnv = { Bindings: Bindings }
