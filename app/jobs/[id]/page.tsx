import { notFound } from "next/navigation"
import type { ReactNode } from "react"
import {
  BadgeCheck,
  BanknoteIcon,
  BarChart3Icon,
  BookmarkIcon,
  BriefcaseIcon,
  CircleDollarSign,
  ClockIcon,
  CodeIcon,
  Fingerprint,
  Laptop,
  MapPinIcon,
  Rocket,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import { getJobsById, type Job } from "@/lib/api/jobs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { ApplyButton } from "./apply-button"

// 25000 -> "25K" so salary stays short (same style as the job cards)
const COMPACT = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

// Placeholder content shown when the API doesn't send these fields yet.
const FALLBACK_DESCRIPTION =
  "We are building the next generation of monitoring tools. We are looking for a senior professional who is passionate about translating complex technical workflows into elegant, intuitive interfaces. You will be a key member of our design team, working closely with engineering and product leadership to define the vision for our core platform experiences."

const FALLBACK_RESPONSIBILITIES = [
  "Lead the end-to-end design process for major platform features, from discovery to high-fidelity implementation.",
  "Collaborate with cross-functional partners to understand user needs and translate them into functional design requirements.",
  "Maintain and evolve our design system, ensuring consistency and accessibility across the entire product suite.",
  "Conduct user research and usability testing to validate design decisions and iterate based on feedback.",
]

const FALLBACK_SKILLS = [
  "Figma Expertise",
  "System Thinking",
  "UI/UX Design",
  "Basic Frontend",
]

const FALLBACK_REQUIREMENTS = [
  "5+ years of experience designing complex B2B SaaS products or data-heavy applications.",
  "A strong portfolio showcasing your design process and problem-solving skills.",
]

const FALLBACK_BENEFITS: Array<{ icon: LucideIcon; label: string }> = [
  { icon: ShieldCheck, label: "Full Health & Dental" },
  { icon: CircleDollarSign, label: "Competitive 401k" },
  { icon: Laptop, label: "Latest Hardware Stipend" },
  { icon: Rocket, label: "Unlimited PTO" },
]

const BENEFIT_ICONS: LucideIcon[] = [
  ShieldCheck,
  CircleDollarSign,
  Laptop,
  Rocket,
]

// The API sends list-like fields as plain strings, so turn them into items
// for the bullet lists. Arrays pass through; strings become one item each.
const toList = (value?: string | string[]): string[] =>
  Array.isArray(value)
    ? value
    : value
      ? value
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
      : []

const SKILL_ICONS: LucideIcon[] = [
  CodeIcon,
  Fingerprint,
  BriefcaseIcon,
  BarChart3Icon,
]

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const job = await getJobsById(id)

  if (!job) notFound()

  const skills = job.skills ?? FALLBACK_SKILLS
  const responsibilities = toList(job.responsibilities)
  const requirements = toList(job.qualifications)
  const fallbackResponsibilities =
    responsibilities.length > 0 ? responsibilities : FALLBACK_RESPONSIBILITIES
  const fallbackRequirements =
    requirements.length > 0 ? requirements : FALLBACK_REQUIREMENTS
  const benefits =
    job.benefits?.map((label: string, i: number) => ({
      icon: BENEFIT_ICONS[i % BENEFIT_ICONS.length],
      label,
    })) ?? FALLBACK_BENEFITS

  return (
    <div className="mx-auto my-10 max-w-7xl space-y-4 px-4">
      <JobHeader job={job} />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          icon={BanknoteIcon}
          label="Salary Range"
          value={`৳${COMPACT.format(Number(job.minSalary))} – ৳${COMPACT.format(Number(job.maxSalary))}`}
        />
        <StatCard
          icon={MapPinIcon}
          label="Location"
          value={job.remote ? `${job.location} (Remote)` : job.location}
        />
        <StatCard icon={ClockIcon} label="Job Type" value={job.jobType} />
        <StatCard
          icon={BarChart3Icon}
          label="Experience"
          value={job.experience ?? "5+ Years"}
        />
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_340px]">
        <main className="min-w-0 space-y-6 rounded-2xl border bg-card p-6">
          <Section title="Job Description">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {job.description ?? FALLBACK_DESCRIPTION}
            </p>
          </Section>

          <Section title="Responsibilities">
            <ul className="list-disc space-y-2.5 pl-4 text-sm text-muted-foreground marker:text-muted-foreground/60">
              {fallbackResponsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="Requirements">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, i: number) => {
                const SkillIcon = SKILL_ICONS[i % SKILL_ICONS.length]
                return (
                  <Badge key={skill} variant="outline" className="h-7 px-3">
                    <SkillIcon />
                    {skill}
                  </Badge>
                )
              })}
            </div>
            <ul className="list-disc space-y-2.5 pl-4 text-sm text-muted-foreground marker:text-muted-foreground/60">
              {fallbackRequirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="Benefits">
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map(({ icon: BenefitIcon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border bg-muted/50">
                    <BenefitIcon className="size-4 text-muted-foreground" />
                  </span>
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </Section>
        </main>

        <CompanyOverview job={job} />
      </div>
    </div>
  )
}

function JobHeader({ job }: { job: Job }) {
  return (
    <header className="rounded-2xl border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-muted/50">
            {job.companyLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={job.companyLogo}
                alt={job.company}
                className="size-full rounded-xl object-cover"
              />
            ) : (
              <BriefcaseIcon className="size-6 text-muted-foreground" />
            )}
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {job.company}
              <span aria-hidden>•</span>
              {job.verified !== false && (
                <span className="flex items-center gap-1 font-medium text-emerald-500">
                  <BadgeCheck className="size-4" />
                  Verified Employer
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="Save job">
            <BookmarkIcon />
          </Button>
          <ApplyButton job={job} />
        </div>
      </div>
    </header>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        <Icon className="size-3.5" />
        {label}
      </p>
      <p className="mt-1.5 truncate text-sm font-semibold">{value}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3.5 border-t border-border/70 pt-6 first:border-t-0 first:pt-0">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  )
}

function CompanyOverview({ job }: { job: Job }) {
  return (
    <aside className="rounded-2xl border bg-card p-5">
      <h2 className="text-lg font-semibold tracking-tight">Company Overview</h2>

      <div className="mt-4 aspect-16/10 overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br from-muted to-background">
        {job.companyLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={job.companyLogo}
            alt={job.company}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <BriefcaseIcon className="size-10 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <dl className="mt-4">
        <div className="flex items-center justify-between gap-3 py-2.5">
          <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Size
          </dt>
          <dd className="text-sm font-medium">
            {job.companySize ?? "250 - 500 Employees"}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border/70 py-2.5">
          <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Industry
          </dt>
          <dd className="text-sm font-medium">
            {job.companyIndustry ?? job.category}
          </dd>
        </div>
      </dl>

      <Button variant="outline" className="mt-2 w-full">
        Visit Website
      </Button>
    </aside>
  )
}
