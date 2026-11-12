"use client"

import { useRouter } from "next/navigation"
import { buildJobsQuery, type JobFilters } from "@/lib/jobs-filters"
import { JOB_CATEGORIES, JOB_TYPES } from "@/lib/job-constants"

export type FilterCounts = {
  total: number
  jobTypes: Record<string, number>
  categories: Record<string, number>
  remote: number
}

// Filter options. Single-select: Job Type and Category behave like radios,
// with an "All" option to clear them. Every change writes the new state to
// the URL, so filtered views can be shared and back button works.
export function JobFiltersPanel({
  filters,
  counts,
  onFilterChange,
}: {
  filters: JobFilters
  counts: FilterCounts
  onFilterChange?: () => void
}) {
  const router = useRouter()

  const apply = (patch: Partial<JobFilters>) => {
    router.push(`/jobs?${buildJobsQuery({ ...filters, ...patch, page: 1 })}`, {
      scroll: false,
    })
    onFilterChange?.()
  }

  return (
    <aside className="space-y-6 rounded-2xl border bg-card p-5">
      <h2 className="text-base font-semibold tracking-tight">Filters</h2>

      <FilterGroup title="Job Type">
        <RadioRow
          name="jobType"
          label="All"
          count={counts.total}
          checked={filters.jobType === ""}
          onChange={() => apply({ jobType: "" })}
        />
        {JOB_TYPES.map((type) => (
          <RadioRow
            key={type}
            name="jobType"
            label={type}
            count={counts.jobTypes[type] ?? 0}
            checked={filters.jobType === type}
            onChange={() => apply({ jobType: type })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Category">
        <RadioRow
          name="category"
          label="All"
          count={counts.total}
          checked={filters.category === ""}
          onChange={() => apply({ category: "" })}
        />
        {JOB_CATEGORIES.map((category) => (
          <RadioRow
            key={category}
            name="category"
            label={category}
            count={counts.categories[category] ?? 0}
            checked={filters.category === category}
            onChange={() => apply({ category })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Work Mode">
        <CheckboxRow
          label="Remote only"
          count={counts.remote}
          checked={filters.remoteOnly}
          onChange={() => apply({ remoteOnly: !filters.remoteOnly })}
        />
      </FilterGroup>
    </aside>
  )
}

function FilterGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-1.5">
      <h3 className="px-1.5 text-sm font-medium">{title}</h3>
      {children}
    </section>
  )
}

function RadioRow({
  name,
  label,
  count,
  checked,
  onChange,
}: {
  name: string
  label: string
  count: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-1.5 py-1 text-sm transition-colors hover:bg-muted/50">
      <span className="flex items-center gap-2.5">
        <input
          type="radio"
          name={name}
          checked={checked}
          onChange={onChange}
          className="size-4 accent-primary"
        />
        {label}
      </span>
      <span className="text-xs text-muted-foreground tabular-nums">
        {count}
      </span>
    </label>
  )
}

function CheckboxRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string
  count: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-1.5 py-1 text-sm transition-colors hover:bg-muted/50">
      <span className="flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="size-4 rounded accent-primary"
        />
        {label}
      </span>
      <span className="text-xs text-muted-foreground tabular-nums">
        {count}
      </span>
    </label>
  )
}
