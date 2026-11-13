const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Lifecycle of an application. Recruiters move it forward; seekers see it
// as the current state of their application.
export const APPLICATION_STATUSES = [
  "Pending",
  "Reviewed",
  "Shortlisted",
  "Interview",
  "Rejected",
  "Hired",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

// A job application document as stored in the database.
// Job info is denormalized (jobTitle/companyName/companyLogo) so application
// lists never need to re-fetch the job, matching how the Job type works.
export type Application = {
  _id: string

  // Relations
  jobId: string // job applied to
  userId: string // applicant (auth user id)

  // Job snapshot at apply time
  jobTitle: string
  companyName: string
  companyLogo?: string
  jobType?: string
  location?: string

  // Applicant details
  fullName: string
  email: string
  phone?: string

  // Application content (filled once the profile/application form provides them)
  resumeUrl?: string // link to the applicant's CV
  coverLetter?: string
  experience?: string
  skills?: string[]

  // Lifecycle
  status: ApplicationStatus
  appliedAt: string // ISO date
  updatedAt: string // ISO date
}

// Payload for creating an application. Everything except _id is provided up
// front so the saved document is complete; the API only needs to assign _id.
export type NewApplication = Omit<Application, "_id">

// All applications saved in the database for one seeker (My Applications page).
// Expected API contract: GET /applications?userId=<id> -> Application[]
export const getApplicationsByUser = async (
  userId: string
): Promise<Application[]> => {
  const res = await fetch(
    `${BASE_URL}/applications?userId=${encodeURIComponent(userId)}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error(`Failed to load applications (status ${res.status})`)
  }

  return res.json()
}
