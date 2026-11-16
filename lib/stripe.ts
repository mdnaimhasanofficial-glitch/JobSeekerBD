import "server-only"

import Stripe from "stripe"

// Fail fast at server start with a clear message, instead of `as string`
// hiding a missing key until the first checkout request crashes with a
// cryptic Stripe error.
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "Missing STRIPE_SECRET_KEY — add it to .env (Stripe dashboard → Developers → API keys)."
  )
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
