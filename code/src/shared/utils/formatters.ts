export const formatCNPJ = (value?: unknown): string => {
  if (!value || typeof value !== 'string') return ''

  const digits = value.replace(/\D/g, '').slice(0, 14)

  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d{2})$/, '$1-$2')
}

export const formatPhone = (value?: unknown): string => {
  if (!value || typeof value !== 'string') return ''

  const digits = value.replace(/\D/g, '')

  if (/^0[3589]00/.test(digits)) {
    return digits.replace(/^(\d{4})(\d{3})(\d{0,4}).*/, '$1 $2-$3').trim()
  }

  if (digits.length <= 8) {
    return digits.replace(/(\d{4})(\d)/, '$1-$2')
  }

  if (digits.length === 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
  }

  if (digits.length === 11) {
    return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }

  if (digits.length < 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  if (digits.length > 11) {
    return digits
      .replace(/^(\d{2,3})(\d{2})(\d{4,5})(\d{0,4}).*/, '+$1 ($2) $3-$4')
      .trim()
  }

  return digits
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cleanFields = <T extends Record<string, any>>(
  entity: T,
  fields: (keyof T)[]
): Partial<T> => {
  const cleanedEntries = fields.map((field) => [
    field,
    entity[field] && String(entity[field]).trim() !== ''
      ? String(entity[field]).replace(/\D/g, '')
      : null,
  ])

  return Object.fromEntries(cleanedEntries) as Partial<T>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, value]) => value !== undefined && value !== null && value !== ''
    )
  ) as Partial<T>
}
