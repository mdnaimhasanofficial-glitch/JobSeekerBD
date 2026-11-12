import { getJobs } from "@/lib/api/jobs"
import {
  applyJobFilters,
  buildJobsQuery,
  countJobsBy,
  paginateJobs,
  parseJobFilters,
} from "@/lib/jobs-filters"
import { JobCard } from "@/components/jobs/job-card"
import { JobFiltersPanel } from "@/components/jobs/job-filters"
import { JobFiltersSheet } from "@/components/jobs/job-filters-sheet"
import { JobSearchBar } from "@/components/jobs/job-search-bar"
import { JobSortSelect } from "@/components/jobs/job-sort-select"
import { JobsPagination } from "@/components/jobs/jobs-pagination"

type BrowseJobsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function BrowseJobsPage({
  searchParams,
}: BrowseJobsPageProps) {
  // 1. Read the current filters from the URL.
  const filters = parseJobFilters(await searchParams)

  // 2. Fetch jobs (keyword search runs on the API), then apply the
  //    remaining filters, sort, and pagination locally.
  const allJobs = await getJobs(buildJobsQuery(filters))
  const filteredJobs = applyJobFilters(allJobs, filters)
  const { jobs, page, totalPages } = paginateJobs(filteredJobs, filters.page)
  const currentFilters = { ...filters, page }

  // Counts shown next to each filter option (computed from all fetched jobs).
  const counts = {
    total: allJobs.length,
    jobTypes: countJobsBy(allJobs, "jobType"),
    categories: countJobsBy(allJobs, "category"),
    remote: allJobs.filter((job) => job.remote).length,
  }

  return (
    <div className="mx-auto my-10 max-w-7xl space-y-6 px-4">
      <JobSearchBar defaultValue={filters.search} />

      <div className="grid items-start gap-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <JobFiltersPanel filters={currentFilters} counts={counts} />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-lg font-bold tracking-tight">
              Found <span className="text-primary">{filteredJobs.length}</span>{" "}
              Professional Jobs
            </h1>
            <div className="flex items-center gap-2">
              {/* Mobile-only filter button; the sidebar shows on lg+ screens. */}
              <JobFiltersSheet
                filters={currentFilters}
                counts={counts}
                className="lg:hidden"
              />
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <JobSortSelect filters={currentFilters} />
            </div>
          </div>

          {jobs.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
              <JobsPagination
                filters={currentFilters}
                totalPages={totalPages}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border bg-card p-10 text-center">
      <p className="font-medium">No jobs match your search</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Try different keywords or remove some filters.
      </p>
    </div>
  )
}
