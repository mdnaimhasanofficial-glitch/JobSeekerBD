const BASE_URL =process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const createJob = async (jobData: Record<string, unknown>) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  })

  if (!res.ok) {
    throw new Error(`Failed to create job (status ${res.status})`)
  }

  return res.json()
}
