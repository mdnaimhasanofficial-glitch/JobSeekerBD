"use client"

import { useState } from "react"
import { SlidersHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  JobFiltersPanel,
  type FilterCounts,
} from "@/components/jobs/job-filters"
import type { JobFilters } from "@/lib/jobs-filters"

// Mobile version of the filter sidebar: a button that opens the same
// JobFiltersPanel inside a Sheet. Shows how many filters are active.
export function JobFiltersSheet({
  filters,
  counts,
  className,
}: {
  filters: JobFilters
  counts: FilterCounts
  className?: string
}) {
  const [open, setOpen] = useState(false)

  const activeCount =
    (filters.jobType ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.remoteOnly ? 1 : 0)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="outline" size="sm" className={className} />}
      >
        <SlidersHorizontalIcon data-icon="inline-start" />
        Filters
        {activeCount > 0 && (
          <span className="rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
            {activeCount}
          </span>
        )}
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-80 max-w-[85vw] overflow-y-auto sm:max-w-80"
      >
        <SheetHeader>
          <SheetTitle>Browse Filters</SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-6">
          <JobFiltersPanel
            filters={filters}
            counts={counts}
            // Close the sheet once a filter is applied.
            onFilterChange={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
