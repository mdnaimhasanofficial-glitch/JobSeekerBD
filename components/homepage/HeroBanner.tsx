"use client"

import Image from "next/image"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
]

export default function HeroBanner() {
  return (
    <section className="relative isolate flex min-h-[calc(100vh-80px)] w-full flex-col overflow-hidden bg-background text-foreground">
      {/* Background Globe Image - Bottom Only (As in Figma) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-70 md:h-110">
        <Image
          src="/globe.png"
          alt="World Globe Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_70%] md:object-[center_45%]"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 pt-16 text-center md:pt-24">
        {/* Top Badge */}
        <Badge
          variant="outline"
          className="mb-6 flex items-center gap-2 rounded-full border-border bg-muted/40 px-4 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase backdrop-blur-sm"
        >
          <span className="text-sm">💼</span>

          <span>
            <strong className="text-foreground">50,000+</strong> NEW JOBS THIS
            MONTH
          </span>
        </Badge>

        {/* Main Heading */}
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground drop-shadow-md sm:text-5xl md:text-6xl">
          Find Your Dream Job Today
        </h1>

        {/* Subtitle */}
        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-muted-foreground drop-shadow sm:text-base">
          JobSeekerBD connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* Search Bar */}
        <div className="mb-6 flex w-full max-w-3xl flex-col items-center gap-2 rounded-2xl border border-border bg-card/80 p-2 shadow-2xl shadow-black/5 backdrop-blur-md md:flex-row md:p-2.5">
          {/* Job Title Field */}
          <div className="relative flex w-full flex-1 items-center px-3">
            <Search className="mr-2 h-5 w-5 shrink-0 text-muted-foreground" />

            <Input
              type="text"
              placeholder="Job title, skill or company"
              className="border-0 bg-transparent text-sm text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Divider */}
          <div className="hidden h-6 w-px bg-border md:block" />

          {/* Location Field */}
          <div className="relative flex w-full flex-1 items-center px-3">
            <MapPin className="mr-2 h-5 w-5 shrink-0 text-muted-foreground" />

            <Input
              type="text"
              placeholder="Location or Remote"
              className="border-0 bg-transparent text-sm text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Search Button */}
          <Button
            size="icon"
            className="h-11 w-full shrink-0 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-lg transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 md:w-12"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Trending Positions */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-muted-foreground">
          <span className="mr-1 font-medium text-muted-foreground">
            Trending Positions:
          </span>

          {trendingPositions.map((position) => (
            <button
              key={position}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-foreground/80 transition-colors duration-200 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-foreground"
            >
              {position}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Assisting Text - On The Globe (As in Figma) */}
      <div className="relative z-10 mx-auto mt-auto w-full max-w-4xl px-4 pt-24 pb-14 text-center md:pb-20">
        <h2 className="mx-auto max-w-xl text-xl leading-snug font-medium text-foreground/90 drop-shadow-md sm:text-2xl md:text-3xl">
          Assisting over{" "}
          <span className="font-semibold text-foreground">15,000 job seekers</span>{" "}
          find their dream positions.
        </h2>
      </div>
    </section>
  )
}
