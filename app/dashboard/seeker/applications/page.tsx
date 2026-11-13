import { headers } from "next/headers"
import Link from "next/link"
import { auth } from "@/lib/auth"
import {
  getApplicationsByUser,
  type Application,
} from "@/lib/api/applications"
import { timeAgo } from "@/lib/utils"
import { StatCard } from "@/components/dashboard/stat-card"
import { ApplicationStatusBadge } from "@/components/applications/application-status-badge"
import { Pagination } from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const APPLICATIONS_PER_PAGE = 5

type ApplicationsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function MyApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  // The seeker layout already guarantees a seeker session, but we still need
  // the user id to load their applications from the database.
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session?.user.id

  const applications = userId ? await getApplicationsByUser(userId) : []

  const page = Math.max(1, Number((await searchParams).page) || 1)
  const totalPages = Math.max(
    1,
    Math.ceil(applications.length / APPLICATIONS_PER_PAGE)
  )
  const safePage = Math.min(page, totalPages)
  const visibleApplications = applications.slice(
    (safePage - 1) * APPLICATIONS_PER_PAGE,
    safePage * APPLICATIONS_PER_PAGE
  )

  const countByStatus = (status: Application["status"]) =>
    applications.filter((application) => application.status === status).length
  const successRate = applications.length
    ? Math.round((countByStatus("Hired") / applications.length) * 100)
    : 0

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
      <PageHeader />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Applied" value={applications.length} />
        <StatCard label="Shortlisted" value={countByStatus("Shortlisted")} />
        <StatCard label="Interviews" value={countByStatus("Interview")} />
        <StatCard label="Success Rate" value={`${successRate}%`} highlight />
      </div>

      {applications.length === 0 ? (
        <EmptyState />
      ) : (
        <ApplicationsTable
          applications={visibleApplications}
          total={applications.length}
          page={safePage}
          totalPages={totalPages}
        />
      )}
    </div>
  )
}

function PageHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Track your job applications and interview progress in real-time.
      </p>
    </div>
  )
}

function ApplicationsTable({
  applications,
  total,
  page,
  totalPages,
}: {
  applications: Application[]
  total: number
  page: number
  totalPages: number
}) {
  const start = (page - 1) * APPLICATIONS_PER_PAGE + 1
  const end = start + applications.length - 1

  return (
    <div className="rounded-xl bg-card ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {application.companyLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={application.companyLogo}
                      alt=""
                      className="size-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="size-10 rounded-lg bg-muted" />
                  )}
                  <div>
                    <p className="font-medium">{application.jobTitle}</p>
                    <JobMeta application={application} />
                  </div>
                </div>
              </TableCell>
              <TableCell>{application.companyName}</TableCell>
              <TableCell className="text-muted-foreground">
                {timeAgo(application.appliedAt)}
              </TableCell>
              <TableCell>
                <ApplicationStatusBadge status={application.status} />
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/jobs/${application.jobId}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Details
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Showing {start}-{end} of {total} applications
        </p>
        <Pagination
          page={page}
          totalPages={totalPages}
          label="Applications pagination"
          buildHref={(pageNumber) =>
            `/dashboard/seeker/applications?page=${pageNumber}`
          }
        />
      </div>
    </div>
  )
}

// Optional snapshot fields, so "Full-time • Remote" only renders what was
// saved with the application.
function JobMeta({ application }: { application: Application }) {
  const parts = [application.jobType, application.location].filter(Boolean)
  if (parts.length === 0) return null

  return <p className="text-xs text-muted-foreground">{parts.join(" • ")}</p>
}

function EmptyState() {
  return (
    <div className="rounded-xl bg-card p-10 text-center ring-1 ring-foreground/10">
      <p className="font-medium">No applications yet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Jobs you apply to will show up here with their current status.
      </p>
      <Link
        href="/jobs"
        className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Browse Jobs
      </Link>
    </div>
  )
}
