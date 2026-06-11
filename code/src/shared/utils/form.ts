import { FieldErrors } from 'react-hook-form'

export interface TabErrorMapping {
  [fieldPath: string]: string
}

export interface TabErrorCounts {
  [tabName: string]: number
}

export function getFormTabErrorCounts(
  errors: FieldErrors,
  fieldToTabMapping: TabErrorMapping
): TabErrorCounts {
  const tabNames = [...new Set(Object.values(fieldToTabMapping))]
  const errorCounts: TabErrorCounts = {}
  tabNames.forEach((tabName) => (errorCounts[tabName] = 0))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processErrors = (errorObj: any, prefix = '') => {
    if (!errorObj || typeof errorObj !== 'object') return

    Object.keys(errorObj).forEach((key) => {
      const fullKey = prefix ? `${prefix}.${key}` : key
      const currentError = errorObj[key]

      if (Array.isArray(currentError)) {
        currentError.forEach((item, index) =>
          processErrors(item, `${fullKey}.${index}`)
        )
      } else if (currentError?.message) {
        const tabName = fieldToTabMapping[fullKey]

        if (tabName) errorCounts[tabName]++
      } else if (typeof currentError === 'object') {
        processErrors(currentError, fullKey)
      }
    })
  }

  processErrors(errors)
  return errorCounts
}
