"use client"

import { useRouter } from "next/navigation"
import { Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { deleteJob } from "@/lib/api/jobs"
import type { Job } from "@/lib/api/jobs"

// Delete button for one row in the recruiter's "Manage Jobs" table.
const ManageJobsDelete = ({ job }: { job: Job }) => {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await deleteJob(job._id)
      toast.add({
        title: "Job Deleted",
        description: "The job has been permanently deleted.",
      })
      router.push("/dashboard/recruiter/jobs")
    } catch (error) {
      console.error("Failed to delete job:", error)
      toast.add({
        title: "Delete failed",
        description: "Something went wrong. Please try again.",
        type: "error",
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Delete"
      onClick={handleDelete}
    >
      <Trash2Icon className="text-amber-500" />
    </Button>
  )
}

export default ManageJobsDelete
