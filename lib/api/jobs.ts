const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export type Job = {
  _id: string
  title: string
  company: string
  category: string
  location: string
  remote: boolean
  jobType: string
  minSalary: number
  maxSalary: number
  frequency: string
  status: "Active" | "Expired" | "Draft"
  deadline: string | null
  posted: string
  applicants?: number
  // Optional details shown on the job details page (when the API provides them)
  // API sends responsibilities/qualifications as plain strings
  description?: string
  responsibilities?: string
  qualifications?: string
  skills?: string[]
  benefits?: string[]
  experience?: string
  verified?: boolean
  companyLogo?: string
  companyWebsite?: string
  companySize?: string
  companyIndustry?: string
}

export const getJobs = async (query = ""): Promise<Job[]> => {
  const url = query ? `${BASE_URL}/jobs?${query}` : `${BASE_URL}/jobs`
  const res = await fetch(url, { cache: "no-store" })
  return res.json()
}

export const getJobsById = async (jobId: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`)
  return res.json()
}
