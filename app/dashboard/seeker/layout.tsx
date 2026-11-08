import { requireRole } from "@/lib/require-role"

export default async function SeekerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Only allow seekers into this section.
  await requireRole("seeker")

  return <>{children}</>
}
