import type { Job } from "@/lib/api/jobs"

// All browse-page state lives in the URL (`/jobs?search=...&jobType=...`).
// These helpers parse that state, apply it to the fetched jobs, and build URLs
// back from it. Keeping them here (no React) makes the logic easy to read,
// reuse, and test.

export type JobSort = "recent" | "salary-high" | "salary-low"

export type JobFilters = {
  search: string
  jobType: string
  category: string
  remoteOnly: boolean
  sort: JobSort
  page: number
}

export type JobSearchParams = Record<string, string | string[] | undefined>

export const JOBS_PER_PAGE = 5

export const DEFAULT_JOB_FILTERS: JobFilters = {
  search: "",
  jobType: "",
  category: "",
  remoteOnly: false,
  sort: "recent",
  page: 1,
}

export const JOB_SORT_OPTIONS: { value: JobSort; label: string }[] = [
  { value: "recent", label: "Most Recent" },
  { value: "salary-high", label: "Highest Salary" },
  { value: "salary-low", label: "Lowest Salary" },
]

const asString = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? (value[0] ?? "") : (value ?? "")

export function parseJobFilters(params: JobSearchParams): JobFilters {
  const sort = params.sort
  return {
    search: asString(params.search),
    jobType: asString(params.jobType),
    category: asString(params.category),
    remoteOnly: params.remote === "1",
    sort: JOB_SORT_OPTIONS.some((option) => option.value === sort)
      ? (sort as JobSort)
      : DEFAULT_JOB_FILTERS.sort,
    page: Math.max(1, Number(params.page) || 1),
  }
}

export function buildJobsQuery(filters: Partial<JobFilters>): string {
  const merged = { ...DEFAULT_JOB_FILTERS, ...filters }
  const params = new URLSearchParams()

  if (merged.search) params.set("search", merged.search)
  if (merged.jobType) params.set("jobType", merged.jobType)
  if (merged.category) params.set("category", merged.category)
  if (merged.remoteOnly) params.set("remote", "1")
  if (merged.sort !== "recent") params.set("sort", merged.sort)
  if (merged.page > 1) params.set("page", String(merged.page))

  return params.toString()
}

// Keyword search is handled by the API; the rest is applied here so the
// browse page works even when the API doesn't support these filters yet.
export function applyJobFilters(jobs: Job[], filters: JobFilters): Job[] {
  const filtered = jobs.filter((job) => {
    const matchesType = !filters.jobType || filters.jobType === job.jobType
    const matchesCategory =
      !filters.category || filters.category === job.category
    const matchesRemote = !filters.remoteOnly || job.remote
    // Older records may not have a status yet, so only exclude known inactive ones.
    const isActive = job.status !== "Expired" && job.status !== "Draft"

    return matchesType && matchesCategory && matchesRemote && isActive
  })

  if (filters.sort === "salary-high") {
    return filtered.sort((a, b) => b.maxSalary - a.maxSalary)
  }
  if (filters.sort === "salary-low") {
    return filtered.sort((a, b) => a.minSalary - b.minSalary)
  }
  return filtered
}

export function paginateJobs(
  jobs: Job[],
  page: number
): { jobs: Job[]; page: number; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(jobs.length / JOBS_PER_PAGE))
  const safePage = Math.min(page, totalPages)

  return {
    jobs: jobs.slice((safePage - 1) * JOBS_PER_PAGE, safePage * JOBS_PER_PAGE),
    page: safePage,
    totalPages,
  }
}

export function countJobsBy(
  jobs: Job[],
  key: "jobType" | "category"
): Record<string, number> {
  return jobs.reduce<Record<string, number>>((counts, job) => {
    counts[job[key]] = (counts[job[key]] ?? 0) + 1
    return counts
  }, {})
}
