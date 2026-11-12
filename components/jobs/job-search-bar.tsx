import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// A plain GET form: submitting navigates to /jobs?search=... and works
// even before JavaScript loads. Nothing else is submitted, so searching
// starts a fresh search.
export function JobSearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/jobs" className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="search"
          defaultValue={defaultValue}
          placeholder="Search by job title, keywords..."
          aria-label="Search jobs"
          className="h-12 rounded-xl pl-10"
        />
      </div>
      <Button type="submit" size="lg" className="h-12 rounded-xl px-6">
        Search Jobs
      </Button>
    </form>
  )
}
