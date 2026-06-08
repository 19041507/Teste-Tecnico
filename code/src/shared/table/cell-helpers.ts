import { CellContext } from '@tanstack/react-table'
import { format } from 'date-fns'

export function textCell<TData>(formatter?: (value: unknown) => string) {
  return (info: CellContext<TData, unknown>) => {
    const value = info.getValue()
    if (formatter) {
      return formatter(value)
    }
    return value ?? ''
  }
}

export function booleanCell<TData>(
  trueLabel = 'Sim',
  falseLabel = 'Não',
  nullLabel = ''
) {
  return (info: CellContext<TData, boolean | null>) => {
    const value = info.getValue()
    if (value === null || value === undefined) return nullLabel
    return value ? trueLabel : falseLabel
  }
}

export function dateCell<TData>(formatStr = 'dd/MM/yyyy', fallback = '') {
  return (info: CellContext<TData, Date | string | null>) => {
    const value = info.getValue()
    if (!value) return fallback

    const date = value instanceof Date ? value : new Date(value)
    return isNaN(date.getTime()) ? fallback : format(date, formatStr)
  }
}

export function enumMapCell<TData, TValue>(
  map: Record<string, string>,
  fallback = ''
) {
  return (info: CellContext<TData, TValue>) =>
    map[String(info.getValue())] ?? fallback
}

export function relationCell<TData, TRelation>(
  accessor: (value: TRelation) => string | undefined
) {
  return (info: CellContext<TData, TRelation | null>) =>
    info.getValue() ? accessor(info.getValue()!) : ''
}
