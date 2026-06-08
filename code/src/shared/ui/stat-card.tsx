import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  value?: number
  label: string
  description?: string
  icon?: LucideIcon
}

export function StatCard({
  value,
  label,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className={`flex flex-col ${description ? 'gap-4' : 'gap-2'}`}>
      <div className="flex flex-row items-start gap-4">
        <div className="flex flex-col gap-0">
          <span className="text-foreground text-base font-medium">{label}</span>
          <span className="text-muted-foreground text-sm">{description}</span>
        </div>
        <div className="ml-auto">
          {Icon && (
            <div className="flex size-12 items-center justify-center rounded-lg border">
              <Icon className="size-6" strokeWidth={1.5} />
            </div>
          )}
        </div>
      </div>
      <span className="text-foreground text-3xl font-semibold">
        {value ?? 0}
      </span>
    </div>
  )
}
