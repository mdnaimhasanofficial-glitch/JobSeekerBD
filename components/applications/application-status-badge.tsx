import { Badge } from "@/components/ui/badge"
import type { ApplicationStatus } from "@/lib/api/applications"

// Colored status pill for an application. Shared by the seeker's
// "My Applications" list and the recruiter's review pipeline.
const STATUS_BADGE: Record<ApplicationStatus, string> = {
  Pending: "bg-muted text-muted-foreground",
  Reviewed: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Shortlisted: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Interview: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  Rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
  Hired: "bg-green-500/10 text-green-600 dark:text-green-400",
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge className={STATUS_BADGE[status]}>{status}</Badge>
}
