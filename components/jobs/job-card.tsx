import {
  BanknoteIcon,
  BookmarkIcon,
  ClockIcon,
  CodeIcon,
  GlobeIcon,
  MapPinIcon,
  PaletteIcon,
  MegaphoneIcon,
  BarChart3Icon,
  BriefcaseIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { Job } from "@/lib/api/jobs"
import { Badge } from "@/components/ui/badge"

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Engineering & Tech": CodeIcon,
  "Software Development": CodeIcon,
  "Data & Analytics": BarChart3Icon,
  "Design & Creative": PaletteIcon,
  "Marketing & Sales": MegaphoneIcon,
  "Business & Operations": BriefcaseIcon,
}

// 25000 -> "25K" so salary badges stay short
const COMPACT = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

const FREQ_SHORT: Record<string, string> = {
  "per hour": "/hr",
  "per day": "/day",
  "per month": "/mo",
  "per year": "/yr",
}

function SalaryBadge({ job }: { job: Job }) {
  return (
    <Badge variant="outline" className="tabular-nums">
      <BanknoteIcon />৳{COMPACT.format(job.minSalary)} – ৳
      {COMPACT.format(job.maxSalary)}
      <span className="text-muted-foreground">{FREQ_SHORT[job.frequency]}</span>
    </Badge>
  )
}

export function JobCard({ job }: { job: Job }) {
  const CategoryIcon = CATEGORY_ICONS[job.category] ?? BriefcaseIcon

  return (
    <article className="flex items-start gap-4 rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-muted/50">
        <CategoryIcon className="size-5 text-muted-foreground" />
      </span>

      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="space-y-1">
          <h3 className="truncate text-base font-semibold tracking-tight">
            {job.title}
          </h3>
          <p className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <span>{job.company}</span>
            <span aria-hidden>•</span>
            <span className="flex items-center gap-1">
              <MapPinIcon className="size-3.5" />
              {job.location}
              {job.remote && " (Remote)"}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SalaryBadge job={job} />
          <Badge variant="outline">
            <ClockIcon />
            {job.jobType}
          </Badge>
          {job.remote && (
            <Badge variant="outline">
              <GlobeIcon />
              Remote
            </Badge>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-label="Save job"
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <BookmarkIcon className="size-4" />
      </button>
    </article>
  )
}
