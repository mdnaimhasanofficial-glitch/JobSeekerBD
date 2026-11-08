import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth, type Role } from "@/lib/auth"

/**
 * Server-side role guard for dashboard layouts.
 *
 * Requires the current better-auth session to belong to `role`.
 * - Not logged in             -> redirect to sign-in.
 * - Logged in as another role -> destroy the session (logout) and redirect.
 */
export async function requireRole(role: Role) {
  const requestHeaders = await headers()

  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session?.user) {
    redirect("/sign-in")
  }

  const userRole = (session.user.role || "").toLowerCase() as Role
  if (!["seeker", "recruiter", "admin"].includes(userRole) || userRole !== role) {
    // Role mismatch: destroy the session so the user is logged out.
    await auth.api.signOut({ headers: requestHeaders })
    redirect("/sign-in")
  }
}
