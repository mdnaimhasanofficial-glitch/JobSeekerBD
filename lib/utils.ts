export { cn } from "cn"

// "just now", "3 hours ago", "2 days ago", "1 month ago" ...
// Falls back to "—" when the date can't be parsed.
export function timeAgo(isoDate: string): string {
  const date = new Date(isoDate).getTime()
  if (Number.isNaN(date)) return "—"

  const seconds = Math.max(0, Math.floor((Date.now() - date) / 1000))
  if (seconds < 60) return "just now"

  const intervals: [number, string][] = [
    [31_536_000, "year"],
    [2_592_000, "month"],
    [604_800, "week"],
    [86_400, "day"],
    [3_600, "hour"],
    [60, "minute"],
  ]

  for (const [size, unit] of intervals) {
    const value = Math.floor(seconds / size)
    if (value >= 1) return `${value} ${unit}${value === 1 ? "" : "s"} ago`
  }

  return "just now"
}
