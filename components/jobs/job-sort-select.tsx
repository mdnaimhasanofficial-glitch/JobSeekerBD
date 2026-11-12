"use client"

import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  buildJobsQuery,
  JOB_SORT_OPTIONS,
  type JobFilters,
  type JobSort,
} from "@/lib/jobs-filters"

export function JobSortSelect({ filters }: { filters: JobFilters }) {
  const router = useRouter()

  const handleSort = (sort: JobSort) => {
    router.push(`/jobs?${buildJobsQuery({ ...filters, sort, page: 1 })}`, {
      scroll: false,
    })
  }

  return (
    <Select
      value={filters.sort}
      onValueChange={(value) => handleSort(value as JobSort)}
    >
      <SelectTrigger size="sm" className="w-40" aria-label="Sort jobs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {JOB_SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
