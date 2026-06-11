import { baseColumn, BaseColumnOptions } from './column-helpers'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function relationArrayColumn<T, R extends Record<string, any>>(
  accessor: keyof T,
  options: BaseColumnOptions<T, R[]> & {
    displayField: keyof R
    separator?: string
    emptyText?: string
  }
) {
  return baseColumn<T, R[]>(
    accessor,
    (info) => {
      const value = info.getValue()

      if (!Array.isArray(value) || value.length === 0) {
        return options.emptyText ?? ''
      }

      return value
        .map((item) => {
          const fieldValue = item[options.displayField]
          return fieldValue != null ? String(fieldValue) : ''
        })
        .join(options.separator ?? ', ')
    },
    { ...options }
  )
}
