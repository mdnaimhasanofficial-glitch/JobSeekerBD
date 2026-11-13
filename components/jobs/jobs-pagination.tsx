import { Pagination } from "@/components/ui/pagination"
import { buildJobsQuery, type JobFilters } from "@/lib/jobs-filters"

// Jobs-specific wrapper around the shared <Pagination /> component: it builds
// page URLs from the current URL-driven job filters.
export function JobsPagination({
  filters,
  totalPages,
}: {
  filters: JobFilters
  totalPages: number
}) {
  return (
    <Pagination
      page={filters.page}
      totalPages={totalPages}
      label="Jobs pagination"
      buildHref={(page) => `/jobs?${buildJobsQuery({ ...filters, page })}`}
    />
  )
}
