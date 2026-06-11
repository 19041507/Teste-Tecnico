import { CellContext } from '@tanstack/react-table'
import { Badge } from '@/shared/ui/badge'

interface Options {
  singular: string
  plural?: string
  empty: string
}

export function arrayCountCell<TData, TValue extends unknown[]>(
  options: Options
) {
  const { singular, plural = `${singular}s`, empty } = options

  const ArrayCountCell = (info: CellContext<TData, TValue | null>) => {
    const length = Array.isArray(info.getValue()) ? info.getValue()!.length : 0

    return (
      <Badge variant="outline">
        {length > 0 ? `${length} ${length > 1 ? plural : singular}` : empty}
      </Badge>
    )
  }

  return ArrayCountCell
}
