"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { createApplication, getApplications } from "@/lib/api/applications"
import {
  MAX_FREE_APPLICATIONS,
  type ApplicationFormData,
} from "@/lib/types/applications"
import { toast } from "@/components/ui/toast"
import type { Job } from "@/lib/api/jobs"

// Client component because useSession/useRouter are React hooks and can't
// run inside the server-rendered job details page.
export function ApplyButton({ job }: { job: Job }) {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user

  // user validation .....
  const handleApplyNow = async () => {
    if (!user) {
      router.push(`/sign-in?redirectTo=/jobs/${job._id}`)
      return
    } else if (user.role === "seeker") {
      // Free plan check: once the seeker has applied to
      // MAX_FREE_APPLICATIONS jobs, send them to the pricing page to pay
      // before they can apply again. Premium users skip this check.
      if (!user.premium) {
        try {
          const existing = await getApplications(
            `userId=${encodeURIComponent(user.id)}`
          )
          if (existing.length >= MAX_FREE_APPLICATIONS) {
            router.push("/pricing")
            return
          }
        } catch (error) {
          // The limit check failed (e.g. API is down) — don't block the
          // application because of that.
          console.error("Failed to check application limit:", error)
        }
      }

      // Full application document: relations, job snapshot, applicant details
      // and lifecycle fields. Optional fields (phone, resumeUrl, coverLetter,
      // experience, skills) are sent once the profile/application form
      // provides them.
      const appliedAt = new Date().toISOString()
      const application: ApplicationFormData = {
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
        const result = await createApplication(application)
        if (result.insertedId) {
          toast.add({
            title: "Job Submitted",
            description: "Your application has been submitted successfully",
          })
          router.push("/jobs")
        }
      } catch (error) {
        console.error("Failed to submit application:", error)
        toast.add({
          title: "Application failed",
          description: "Something went wrong. Please try again.",
          type: "error",
        })
      }
    } else {
      toast.add({
        title: "Not allowed",
        description: "Only job seekers can apply to jobs.",
        type: "warning",
      })
      router.push("/jobs")
    }
  }

  return (
    <Button onClick={handleApplyNow} size="lg">
      Apply Now
    </Button>
  )
}
