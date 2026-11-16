import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

// The Premium product's Stripe Price ID (price_...) — kept in .env so the
// plan can change per environment without touching code.
const PRICE_ID = process.env.STRIPE_PRICE_ID

// A browser form POST always sends the Origin header, so the success/cancel
// redirect URLs are built from it.
const getOrigin = (requestHeaders: Headers) =>
  requestHeaders.get("origin") ?? "http://localhost:3000"

export async function POST() {
  // The session lives in the request cookies, so better-auth needs the
  // incoming request headers to find it.
  const requestHeaders = await headers()
  const userSession = await auth.api.getSession({ headers: requestHeaders })

  // Not signed in? Nothing to charge — stop before talking to Stripe.
  if (!userSession) {
    return NextResponse.json(
      { error: "Please sign in to upgrade." },
      { status: 401 }
    )
  }

  // Server misconfiguration, not the user's fault — say so clearly.
  if (!PRICE_ID) {
    return NextResponse.json(
      { error: "Stripe price is not configured." },
      { status: 500 }
    )
  }

  const origin = getOrigin(requestHeaders)

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      mode: "payment",
      customer_email: userSession.user.email,
      // The backend reads metadata.userId in /payments/checkout-verify to
      // know WHICH user to mark as premium after a successful payment.
      metadata: { userId: userSession.user.id },
      // Stripe replaces {CHECKOUT_SESSION_ID} with the real session ID, so
      // the success page receives ?session_id=cs_test_... to verify.
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      // The pricing page reads ?canceled= to show a "payment canceled" note.
      cancel_url: `${origin}/pricing?canceled=true`,
      automatic_tax: { enabled: true },
      // Labels this Checkout integration in the Stripe dashboard so its
      // conversion can be measured separately.
      integration_identifier: "JobSeekerBD_Web",
    })

    // Stripe types url as string | null — never assume it exists.
    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      )
    }

    // 303 tells the browser to follow the redirect with a GET.
    return NextResponse.redirect(checkoutSession.url, 303)
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to start checkout."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
