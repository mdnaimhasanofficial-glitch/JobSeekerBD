import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { buildJobsQuery, type JobFilters } from "@/lib/jobs-filters"
import { cn } from "cn"

// ‹ 1 2 3 … 42 › style pagination. Every page is a real link, so it works
// without JavaScript and is server-rendered.
export function JobsPagination({
  filters,
  totalPages,
}: {
  filters: JobFilters
  totalPages: number
}) {
  if (totalPages <= 1) return null

  const href = (page: number) => `/jobs?${buildJobsQuery({ ...filters, page })}`

  return (
    <nav
      aria-label="Jobs pagination"
      className="flex items-center justify-center gap-1.5"
    >
      <PageLink
        href={href(filters.page - 1)}
        disabled={filters.page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="size-4" />
      </PageLink>

      {getPaginationPages(filters.page, totalPages).map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <PageLink
            key={page}
            href={href(page)}
            active={page === filters.page}
            aria-label={`Page ${page}`}
          >
            {page}
          </PageLink>
        )
      )}

      <PageLink
        href={href(filters.page + 1)}
        disabled={filters.page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRightIcon className="size-4" />
      </PageLink>
    </nav>
  )
}

function PageLink({
  href,
  active = false,
  disabled = false,
  children,
  ...props
}: {
  href: string
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
} & React.ComponentProps<typeof Link>) {
  const className = cn(
    "flex size-8 items-center justify-center rounded-lg border text-sm transition-colors",
    active
      ? "border-transparent bg-primary text-primary-foreground"
      : "hover:bg-muted",
    disabled && "pointer-events-none opacity-40"
  )

  if (disabled) {
    return (
      <span aria-hidden className={className}>
        {children}
      </span>
    )
  }

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={className}
      {...props}
    >
      {children}
    </Link>
  )
}

// Window of pages around the current one, with "…" where numbers are skipped.
function getPaginationPages(
  current: number,
  total: number
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const pages = [
    1,
    ...range(Math.max(2, current - 1), Math.min(total - 1, current + 1)),
    total,
  ]

  return pages.flatMap((page, index) => {
    const previous = pages[index - 1]
    if (index > 0 && page - previous > 1) return ["ellipsis" as const, page]
    return [page]
  })
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}
