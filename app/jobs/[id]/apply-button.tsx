"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { Job } from "@/lib/api/jobs"
import { NewApplication } from "@/lib/api/applications"
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
      // Full application document: relations, job snapshot, applicant details
      // and lifecycle fields. Optional fields (phone, resumeUrl, coverLetter,
      // experience, skills) are sent once the profile/application form
      // provides them.
      const appliedAt = new Date().toISOString()
      const application: NewApplication = {
        jobId: job._id,
        userId: user.id,

        jobTitle: job.title,
        companyName: job.company,
        companyLogo: job.companyLogo,
        jobType: job.jobType,
        location: job.location,

        fullName: user.name,
        email: user.email,

        status: "Pending",
        appliedAt,
        updatedAt: appliedAt,
      }

      try {
        const result = await ApplyToAJob(application)
        if (result.insertedId) {
          console.log("Application submitted successfully")
          router.push("/jobs")
        }
      } catch (error) {
        console.error("Failed to submit application:", error)
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
