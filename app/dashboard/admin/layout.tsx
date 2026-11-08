import { requireRole } from "@/lib/require-role"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Only allow admins into this section.
  await requireRole("admin")

  return <>{children}</>
}
