export const enumToOptions = <T extends object>(
  enumObj: T,
  includeEmpty = false
) => {
  const opts = Object.values(enumObj).map((v) => ({
    value: v,
    label: String(v),
  }))
  return includeEmpty ? [{ value: undefined, label: 'ㅤ' }, ...opts] : opts
}

export const toOptions = <T>(
  items: T[] | undefined,
  mapFn: (item: T) => { value: string; label: string }
): { value: string; label: string }[] => {
  return items ? items.map(mapFn) : []
}

export const ensureArray = <T>(value: T | T[] | undefined): T[] => {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}
