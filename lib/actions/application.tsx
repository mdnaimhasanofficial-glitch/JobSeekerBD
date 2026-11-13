import type { NewApplication } from "@/lib/api/applications"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Saves a complete application document to the database.
// The payload is a full NewApplication, so the API only has to insert it.
export async function ApplyToAJob(data: NewApplication) {
  const response = await fetch(`${BASE_URL}/application`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to submit application (status ${response.status})`)
  }

  return response.json()
}
