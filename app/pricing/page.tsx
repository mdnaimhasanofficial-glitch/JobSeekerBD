import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MAX_FREE_APPLICATIONS } from "@/lib/types/applications"

// The Premium checkout posts to /api/checkout_sessions, which creates a
// Stripe Checkout session and redirects the buyer there. If the buyer
// cancels, Stripe sends them back with ?canceled=true.
export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>
}) {
  const { canceled } = await searchParams

  return (
    <div className="mx-auto my-10 max-w-3xl space-y-6 px-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Choose your plan</h1>
        <p className="text-muted-foreground">
          Your first {MAX_FREE_APPLICATIONS} job applications are free. Upgrade
          to keep applying without limits.
        </p>
      </div>

      {canceled && (
        <p className="rounded-xl bg-muted/50 px-4 py-3 text-center text-sm text-muted-foreground ring-1 ring-foreground/10">
          Payment canceled — no charge was made. You can upgrade anytime.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Free plan */}
        <div className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
          <p className="text-sm font-medium text-muted-foreground">Free</p>
          <p className="mt-2 text-3xl font-bold">৳0</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>✓ Browse all jobs</li>
            <li>✓ Apply to {MAX_FREE_APPLICATIONS} jobs</li>
            <li>✓ Track application status</li>
          </ul>
        </div>

        {/* Premium plan */}
        <div className="rounded-xl bg-card p-6 ring-1 ring-primary/30">
          <p className="text-sm font-medium text-primary">Premium</p>
          <p className="mt-2 text-3xl font-bold">
            ৳100
            <span className="text-sm font-normal text-muted-foreground">
              /month
            </span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>✓ Unlimited job applications</li>
            <li>✓ Priority support</li>
          </ul>

          <form action="/api/checkout_sessions" method="POST">
            <Button type="submit" role="link" className="mt-6 w-full">
              Pay Now — ৳100
            </Button>
          </form>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/jobs"
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to jobs
        </Link>
      </div>
    </div>
  )
}
