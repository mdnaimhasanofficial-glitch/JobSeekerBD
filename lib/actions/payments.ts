const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// POST /payments/checkout-verify — asks the backend to confirm a Stripe
// Checkout session was actually paid. The success page should never trust
// the ?session_id= in the URL alone, because anyone can type one in.
export const checkoutVerify = async (sessionId?: string) => {
  if (!sessionId) {
    throw new Error("Missing checkout session ID to verify.")
  }

  const res = await fetch(`${BASE_URL}/payments/checkout-verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
  })

  if (!res.ok) {
    throw new Error(`Payment verification failed (status ${res.status})`)
  }

  return res.json()
}
