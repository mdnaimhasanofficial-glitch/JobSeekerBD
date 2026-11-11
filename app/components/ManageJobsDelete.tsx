"use client"

import { Job } from "@/lib/api/jobs"
import { Button } from "@/components/ui/button"
import { Trash2Icon } from "lucide-react"
import { deleteJob } from "@/lib/actions/jobs"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"

const ManageJobsDelete = ({ job }: { job: Job }) => {
  const router = useRouter()
  const handleDelete = async () => {
    const res = await deleteJob(job._id)

    console.log("delete job id", job._id, res)
    toast.add({
      title: "Job Deleted",
      description: "The job has been permanently deleted.",
    })
    router.push("/dashboard/recruiter/jobs")
  }
  return (
    <div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete"
        onClick={handleDelete}
      >
        <Trash2Icon className="text-amber-500" />
      </Button>
    </div>
  )
}

export default ManageJobsDelete
