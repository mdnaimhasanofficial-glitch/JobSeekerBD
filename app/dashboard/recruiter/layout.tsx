import { requireRole } from "@/lib/require-role"

export default async function RecruiterDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Only allow recruiters into this section.
  await requireRole("recruiter")

  return <>{children}</>
}
