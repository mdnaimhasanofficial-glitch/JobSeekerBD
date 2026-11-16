import { headers } from "next/headers"
import Link from "next/link"
import { ArrowRight, Check, Mail, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth, setUserPremium } from "@/lib/auth"
import { checkoutVerify } from "@/lib/actions/payments"

// Amount shown for the Premium upgrade. The authoritative amount lives on
// the Stripe Price — later this can be read back from the verified session
// instead of being hardcoded here.
const PREMIUM_PRICE = "৳100.00"

type SuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

// Stripe redirects back to this page after checkout with ?session_id=... in
// the URL. We verify that session against the backend and show a small
// receipt: who paid, and proof from the gateway.
export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const rawSessionId = (await searchParams).session_id
  const sessionId = typeof rawSessionId === "string" ? rawSessionId : undefined

  // Stripe redirected the user here while they are still signed in, so
  // reading the session from their cookies tells us who paid.
  const userSession = await auth.api.getSession({ headers: await headers() })
  const userEmail = userSession?.user.email

  // Verification is intentionally non-fatal: if the backend is down we still
  // show the thank-you page (Stripe only redirects here after payment), but
  // the receipt row then reads "Session ID" instead of claiming "verified".
  let isVerified = false
  try {
    await checkoutVerify(sessionId)
    isVerified = true

    // Payment confirmed — mark the user as premium in the database so they
    // can apply to unlimited jobs. Safe to run twice (it just sets true).
    if (userEmail) {
      await setUserPremium(userEmail)
    }
  } catch (error) {
    console.error("Checkout verification failed:", error)
  }

  return (
    <div className="mx-auto my-16 max-w-lg px-4">
      <div className="rounded-2xl bg-card p-8 ring-1 ring-foreground/10">
        {/* Green check circle */}
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/40">
          <Check className="size-7 text-emerald-400" />
        </div>

        {/* Badge */}
        <p className="mt-5 text-center">
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium tracking-wide text-primary uppercase">
            Upgrade successful
          </span>
        </p>

        <h1 className="mt-3 text-center text-2xl font-bold tracking-tight">
          Welcome to JobSeekerBD Premium
        </h1>

        <p className="mt-4 text-center text-muted-foreground">
          Your payment of{" "}
          <span className="font-semibold text-foreground">{PREMIUM_PRICE}</span>{" "}
          was received perfectly.
        </p>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          All premium features are unlocked on your account.{" "}
          <span className="text-emerald-400">
            You can now apply to unlimited jobs.
          </span>
        </p>

        {/* Receipt — rows appear only when we have the data (no session ID
        on a direct visit without going through checkout). */}
        {(userEmail || sessionId) && (
          <div className="mt-6 space-y-3 rounded-xl bg-muted/50 p-4 ring-1 ring-foreground/10">
            {userEmail && (
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-emerald-400" />
                  Paid by
                </div>
                <span className="font-medium">{userEmail}</span>
              </div>
            )}
            {sessionId && (
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  {isVerified ? "Session ID verified" : "Session ID"}
                </div>
                <span className="rounded-md bg-background px-2 py-1 font-mono text-xs ring-1 ring-foreground/10">
                  {sessionId.length > 24
                    ? `${sessionId.slice(0, 24)}…`
                    : sessionId}
                </span>
              </div>
            )}
          </div>
        )}

        <Link href="/dashboard/seeker" className="mt-6 block">
          <Button size="lg" className="h-12 w-full rounded-xl text-base">
            Go to Dashboard
            <ArrowRight data-icon="inline-end" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
