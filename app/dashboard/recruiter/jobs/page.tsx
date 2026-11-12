import Link from "next/link"
import {
  BarChart3Icon,
  BriefcaseIcon,
  CodeIcon,
  EllipsisVerticalIcon,
  GlobeIcon,
  MapPinIcon,
  MegaphoneIcon,
  PaletteIcon,
  PencilLineIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getJobs, type Job } from "@/lib/api/jobs"
import ManageJobsDelete from "@/app/components/ManageJobsDelete"

const CATEGORY_META: Record<string, { icon: LucideIcon; color: string }> = {
  "Engineering & Tech": { icon: CodeIcon, color: "text-indigo-500" },
  "Software Development": { icon: CodeIcon, color: "text-indigo-500" },
  "Data & Analytics": { icon: BarChart3Icon, color: "text-blue-500" },
  "Design & Creative": { icon: PaletteIcon, color: "text-orange-500" },
  "Marketing & Sales": { icon: MegaphoneIcon, color: "text-amber-500" },
  "Business & Operations": { icon: BriefcaseIcon, color: "text-emerald-500" },
}

const FREQ_SHORT: Record<string, string> = {
  "per hour": "/ hr",
  "per day": "/ day",
  "per month": "/ mo",
  "per year": "/ yr",
}

// 25000 -> "25K", 950 -> "950" (keeps the compensation column narrow)
const COMPACT = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

const STATUS_STYLES: Record<Job["status"], string> = {
  Active: "text-emerald-600 dark:text-emerald-400",
  Expired: "text-muted-foreground",
  Draft: "text-amber-600 dark:text-amber-400",
}

const STATUS_DOTS: Record<Job["status"], string> = {
  Active: "bg-emerald-500",
  Expired: "bg-muted-foreground/50",
  Draft: "bg-amber-500",
}

function Compensation({ job }: { job: Job }) {
  return (
    <span className="text-sm tabular-nums">
      ৳{COMPACT.format(job.minSalary)} – ৳{COMPACT.format(job.maxSalary)}{" "}
      <span className="text-muted-foreground">{FREQ_SHORT[job.frequency]}</span>
    </span>
  )
}

function CategoryIcon({ category }: { category: string }) {
  const meta = CATEGORY_META[category]
  const Icon = meta?.icon ?? BriefcaseIcon
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/50">
      <Icon className={`size-4 ${meta?.color ?? "text-muted-foreground"}`} />
    </span>
  )
}

function StatusBadge({ status }: { status: Job["status"] }) {
  return (
    <Badge variant="outline" className={STATUS_STYLES[status]}>
      <span className={`size-1.5 rounded-full ${STATUS_DOTS[status]}`} />
      {status}
    </Badge>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function ManageJobsPage() {
  const JOBS: Job[] = await getJobs()
  // console.log(JOBS)

  return (
    <div className="mx-auto my-10 max-w-7xl">
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          <Link
            href="/dashboard/recruiter/jobs"
            className="hover:text-foreground"
          >
            Manage Jobs
          </Link>{" "}
          &gt;{" "}
          <Link
            href="/dashboard/recruiter/jobs"
            className="hover:text-foreground"
          >
            Job Listings &amp; Postings
          </Link>
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Manage Job Posts
            </h1>
            <p className="text-sm text-muted-foreground">
              Review live listings, monitor applicants, and update job details
              across your organization.
            </p>
          </div>
          <Button
            size="lg"
            className="rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700"
            render={<Link href="/dashboard/recruiter/jobs/new" />}
          >
            <PlusIcon data-icon="inline-start" />
            New Job Post
          </Button>
        </div>
      </div>

      <Card className="mt-8 rounded-2xl border-border/70">
        <Table className="[&_td]:px-3 [&_td]:py-3.5 [&_th]:px-3 [&_th]:py-3.5">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs text-muted-foreground">
                Job Title &amp; Dept
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Company &amp; Location
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Type
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Compensation
              </TableHead>
              <TableHead className="hidden text-xs text-muted-foreground xl:table-cell">
                Applicants
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="hidden text-xs text-muted-foreground lg:table-cell">
                Deadline
              </TableHead>
              <TableHead className="pr-4 text-right text-xs text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {JOBS.map((job) => (
              <TableRow key={job._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={job.category} />
                    <div>
                      <p className="max-w-[180px] truncate text-sm font-medium">
                        {job.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {job.category.replace(" & ", " ")}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{job.company}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    {job.remote ? (
                      <GlobeIcon className="size-3" />
                    ) : (
                      <MapPinIcon className="size-3" />
                    )}
                    {job.remote ? "Remote" : job.location}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{job.jobType}</Badge>
                </TableCell>
                <TableCell>
                  <Compensation job={job} />
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <span className="flex items-center gap-1.5 text-sm">
                    <UsersIcon className="size-3.5 text-muted-foreground" />
                    {job.applicants ?? 0} Candidates
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={job.status} />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div>
                    <p className="text-sm">
                      {job.deadline ? formatDate(job.deadline) : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {job.status === "Expired"
                        ? "Closed"
                        : job.status === "Draft"
                          ? "Not published"
                          : `Posted ${job.posted}`}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="outline" size="sm">
                      <PencilLineIcon
                        data-icon="inline-start"
                        className="text-indigo-500"
                      />
                      Update
                    </Button>
                    <ManageJobsDelete job={job} />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="More options"
                    >
                      <EllipsisVerticalIcon className="text-muted-foreground" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
