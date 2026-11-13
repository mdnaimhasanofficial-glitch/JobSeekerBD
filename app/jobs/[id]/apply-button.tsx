"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { Job } from "@/lib/api/jobs"

// Client component because useSession/useRouter are React hooks and can't
// run inside the server-rendered job details page.
export function ApplyButton({ job }: { job: Job }) {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user

  const handleApplyNow = () => {
    if (!user) {
      router.push(`/sign-in?redirectTo=/jobs/${job._id}`)
      return
    } else {
    }
  }

  return (
    <Button onClick={handleApplyNow} size="lg">
      Apply Now
    </Button>
  )
}
