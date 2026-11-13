"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { Job } from "@/lib/api/jobs"
import { ApplyToAJob } from "@/lib/actions/application"

// Client component because useSession/useRouter are React hooks and can't
// run inside the server-rendered job details page.
export function ApplyButton({ job }: { job: Job }) {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user

  const handleApplyNow = async () => {
    if (!user) {
      router.push(`/sign-in?redirectTo=/jobs/${job._id}`)
      return
    } else if (user.role === "seeker") {
      const application = {
        jobId: job._id,
        userId: user.id,
        email: user.email,
        jobTitle: job.title,
        companyName: job.company,
      }

      const result = await ApplyToAJob(application)
      if (result.insertedId) {
        console.log("Application submitted successfully")
        router.push("/jobs")
      }
    } else {
      console.log("user is not a job seeker")
    }
  }

  return (
    <Button onClick={handleApplyNow} size="lg">
      Apply Now
    </Button>
  )
}
