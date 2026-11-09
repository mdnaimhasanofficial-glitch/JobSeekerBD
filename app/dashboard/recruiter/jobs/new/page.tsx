"use client"

import Link from "next/link"
import { useState } from "react"
import {
  CalendarIcon,
  GlobeIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createJob } from "@/lib/actions/jobs"

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"]

const JOB_CATEGORIES = [
  "Engineering & Tech",
  "Software Development",
  "Design & Creative",
  "Marketing & Sales",
  "Data & Analytics",
  "Business & Operations",
]

const FREQUENCIES = ["per hour", "per day", "per month", "per year"]

export default function NewJobPage() {
  const [jobType, setJobType] = useState("Full-time")

  // Easy data style: one plain form, one plain object on submit, then POST it.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const raw = Object.fromEntries(new FormData(form))
    const jobData = {
      ...raw,
      remote: raw.remote === "on",
    }

    try {
      const result = await createJob(jobData)
      console.log("Job created:", result)
      form.reset()
    } catch (error) {
      console.error("Failed to create job:", error)
    }
  }

  return (
    <div className="mx-auto my-10 max-w-5xl">
      <p className="text-xs text-muted-foreground">
        <Link
          href="/dashboard/recruiter/jobs"
          className="hover:text-foreground"
        >
          Manage Jobs
        </Link>{" "}
        &gt; Create New Listing
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Post a New Job
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill in the position specifications to attract qualified talent
              across our network.
            </p>
          </div>
        </div>

        {/* 1. Basic Information */}
        <Card className="rounded-2xl border-border/70">
          <CardContent className="space-y-5">
            <div className="flex items-center gap-2.5 text-sm font-semibold">
              <span className="size-2 shrink-0 rounded-full bg-indigo-500" />
              1. Basic Information
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Job Title <span className="text-indigo-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Frontend Developer"
                required
                className="h-11 rounded-xl"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">
                  Company Name <span className="text-indigo-500">*</span>
                </Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="HirePulse Network"
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Job Category <span className="text-indigo-500">*</span>
                </Label>
                <Select
                  name="category"

                  defaultValue={JOB_CATEGORIES[0]}
                  required
                >
                  <SelectTrigger className="h-11 w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Job Type <span className="text-indigo-500">*</span>
              </Label>
              <input type="hidden" name="jobType" value={jobType} />
              <div className="grid grid-cols-4 gap-2.5">
                {JOB_TYPES.map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setJobType(type)}
                    className={
                      type === jobType
                        ? "h-11 rounded-xl border border-indigo-500 bg-indigo-500/10 text-sm font-medium text-indigo-500 transition-colors"
                        : "h-11 rounded-xl border border-border text-sm text-muted-foreground transition-colors hover:bg-muted/50"
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Location, Compensation & Timeline */}
        <Card className="rounded-2xl border-border/70">
          <CardContent className="space-y-5">
            <div className="flex items-center gap-2.5 text-sm font-semibold">
              <span className="size-2 shrink-0 rounded-full bg-indigo-500" />
              2. Location, Compensation & Timeline
            </div>

            {/* Remote toggle */}
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-500">
                  <GlobeIcon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Remote Work Allowed</p>
                  <p className="text-xs text-muted-foreground">
                    Remote Work Allowed (Optional)
                  </p>
                </div>
              </div>
              <Switch name="remote" aria-label="Remote work allowed" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="location">Job Location (location)</Label>
                  <span className="text-[10px] text-muted-foreground">
                    Required
                  </span>
                </div>
                <div className="relative">
                  <MapPinIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    placeholder="Dhaka, Bangladesh"
                    required
                    className="h-11 rounded-xl pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">
                  Application Deadline (deadline)
                </Label>
                <div className="relative">
                  <CalendarIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    className="h-11 rounded-xl pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="minSalary">Min Salary / Rate</Label>
                <Input
                  id="minSalary"
                  name="minSalary"
                  type="number"
                  min="0"
                  placeholder="25,000"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxSalary">Max Salary / Rate</Label>
                <Input
                  id="maxSalary"
                  name="maxSalary"
                  type="number"
                  min="0"
                  placeholder="40,000"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  name="frequency"
                  // items={FREQUENCIES}
                  defaultValue="per hour"
                >
                  <SelectTrigger className="h-11 w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((frequency) => (
                      <SelectItem key={frequency} value={frequency}>
                        {frequency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Responsibilities & Requirements */}
        <Card className="rounded-2xl border-border/70">
          <CardContent className="space-y-5">
            <div className="flex items-center gap-2.5 text-sm font-semibold">
              <span className="size-2 shrink-0 rounded-full bg-indigo-500" />
              3. Responsibilities & Requirements
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibilities">
                Key Responsibilities <span className="text-indigo-500">*</span>
              </Label>
              <Textarea
                id="responsibilities"
                name="responsibilities"
                rows={4}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualifications">
                Qualifications & Requirements{" "}
                <span className="text-indigo-500">*</span>
              </Label>
              <Textarea
                id="qualifications"
                name="qualifications"
                rows={4}
                required
                className="rounded-xl"
              />
            </div>
            <section>
              <Button
                type="submit"
                size="lg"
                className="rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-600 hover:to-purple-700"
              >
                Publish Job
                <ArrowRightIcon />
              </Button>
            </section>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
