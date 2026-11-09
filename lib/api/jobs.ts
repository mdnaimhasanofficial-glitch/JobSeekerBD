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
  status: string
  deadline: string | null
  posted: string
  applicants?: number
}

export const getJobs = async (): Promise<Job[]> => {
  const res = await fetch(`${BASE_URL}/jobs`, { cache: "no-store" })
  return res.json()
}
