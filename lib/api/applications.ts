import type {
  ApplicationFormData,
  ApplicationRow,
} from "@/lib/types/applications"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// GET /applications?<query> — e.g. "userId=<id>" lists everything one seeker
// applied to (My Applications page).
export const getApplications = async (
  query = ""
): Promise<ApplicationRow[]> => {
  const res = await fetch(`${BASE_URL}/applications?${query}`, {
    cache: "no-store", // always show the latest applications
  })

  if (!res.ok) {
    throw new Error(`Failed to load applications (status ${res.status})`)
  }

  return res.json()
}

// GET /applications?<query> — count-only read for stats and badges, so the UI
// never has to load every row just to show a number.
export const getApplicationsCount = async (
  query = ""
): Promise<{ count: number }> => {
  const res = await fetch(`${BASE_URL}/applications?${query}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Failed to count applications (status ${res.status})`)
  }

  return res.json()
}

// POST /application — saves a complete application document to the database.
// The payload is a full ApplicationFormData, so the API only has to insert it.
export const createApplication = async (data: ApplicationFormData) => {
  const res = await fetch(`${BASE_URL}/application`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error(`Failed to submit application (status ${res.status})`)
  }

  return res.json()
}
