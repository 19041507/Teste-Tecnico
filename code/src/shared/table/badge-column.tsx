import { Badge } from '@/shared/ui/badge'
import { baseColumn, BaseColumnOptions } from './column-helpers'

type BadgeConfig = {
  label?: string
  className?: string
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

export function badgeColumn<T, TValue extends string | number | boolean>(
  accessor: keyof T,
  options: BaseColumnOptions<T, TValue> & {
    map: Record<string, BadgeConfig>
    emptyText?: string
  }
) {
  return baseColumn<T, TValue>(
    accessor,
    (info) => {
      const value = info.getValue() as string | number | boolean | undefined
      if (value === undefined || value === null) return options.emptyText ?? ''

      const config = options.map[String(value)]
      if (!config) return String(value)

      return (
        <div className="flex items-center gap-2" title={String(value)}>
          <Badge
            variant={config.variant ?? 'default'}
            className={config.className}
          >
            {config.label ?? String(value)}
          </Badge>
        </div>
      )
    },
    {
      ...options,
    }
  )
}
