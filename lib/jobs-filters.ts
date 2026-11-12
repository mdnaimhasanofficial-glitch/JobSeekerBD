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

// All filters are applied here, including the keyword search (see
// `matchesSearch`) so it can look across several fields and tolerate small
// typos, even though the API has its own basic search.
export function applyJobFilters(jobs: Job[], filters: JobFilters): Job[] {
  const filtered = jobs.filter((job) => {
    const matchesKeyword = matchesSearch(job, filters.search)
    const matchesType = !filters.jobType || filters.jobType === job.jobType
    const matchesCategory =
      !filters.category || filters.category === job.category
    const matchesRemote = !filters.remoteOnly || job.remote
    // Older records may not have a status yet, so only exclude known inactive ones.
    const isActive = job.status !== "Expired" && job.status !== "Draft"

    return (
      matchesKeyword &&
      matchesType &&
      matchesCategory &&
      matchesRemote &&
      isActive
    )
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

// Keyword matching for search. Rules:
// - Case-insensitive and partial: "dev" matches "MERN Stack Developer".
// - Searches several fields: title, company, location, category, job type.
// - Multi-word: every word must match somewhere ("react intern" works).
// - Typo tolerant: 1–2 letter mistakes still match ("designr" -> "Designer").
function matchesSearch(job: Job, search: string): boolean {
  const words = search.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return true

  const fields = [
    job.title,
    job.company,
    job.location,
    job.category,
    job.jobType,
  ].map((field) => field.toLowerCase())

  return words.every((word) =>
    fields.some(
      (field) => field.includes(word) || fieldHasSimilarWord(field, word)
    )
  )
}

// Checks a field's individual words against the search word with a small
// edit-distance allowance, so "designr" still matches "designer".
function fieldHasSimilarWord(field: string, word: string): boolean {
  if (word.length < 4) return false // too short to guess a typo reliably

  const maxDistance = word.length >= 6 ? 2 : 1
  return field.split(/\s+/).some((fieldWord) => {
    const clean = fieldWord.replace(/[^a-z0-9]/g, "")
    return clean.length >= 4 && levenshtein(word, clean) <= maxDistance
  })
}

// Minimum number of single-character edits to turn `a` into `b`.
function levenshtein(a: string, b: string): number {
  const rows = Array.from({ length: a.length + 1 }, (_, i) => [i])
  const firstRow = rows[0]
  for (let j = 1; j <= b.length; j++) firstRow[j] = j

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1, // delete
        rows[i][j - 1] + 1, // insert
        rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // replace
      )
    }
  }

  return rows[a.length][b.length]
}
