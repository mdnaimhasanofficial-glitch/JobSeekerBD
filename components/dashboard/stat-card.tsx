import { cn } from "cn"

// Small label + number card used across the dashboards
// (Total Applied, Success Rate, ...).
export function StatCard({
  label,
  value,
  highlight = false,
  className,
}: {
  label: string
  value: number | string
  highlight?: boolean
  className?: string
}) {
  return (
    <div className={cn("rounded-xl bg-card p-4 ring-1 ring-foreground/10", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 text-2xl font-bold",
          highlight && "text-green-600 dark:text-green-400"
        )}
      >
        {value}
      </p>
    </div>
  )
}
