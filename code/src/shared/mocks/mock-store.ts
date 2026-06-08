/**
 * Datastore mockado em memória — base para os services rodarem SEM backend.
 *
 * Usado pelos services de `companies` e `users` e serve de referência para o
 * service do módulo de Veículos (vehicles). Em ambiente real, estas
 * funções seriam substituídas por chamadas HTTP (ver `src/core/http/axios.ts`).
 */

export interface PageMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Paginated<T> {
  data: T[]
  meta: PageMeta
}

export interface PaginationQuery {
  page: number
  limit: number
  orderBy: string
  order: 'asc' | 'desc'
}

/** Pequeno atraso para simular latência de rede. */
export function delay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Gera um id pseudo-único para registros criados no mock. */
export function genId(prefix = 'mock'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1

  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (typeof a === 'boolean' && typeof b === 'boolean')
    return Number(a) - Number(b)

  return String(a).localeCompare(String(b), 'pt-BR', { sensitivity: 'base' })
}

/**
 * Ordena e pagina uma lista em memória, devolvendo o mesmo shape esperado pelas
 * tabelas: `{ data, meta: { total, page, limit, totalPages } }`.
 */
export function paginate<T extends Record<string, unknown>>(
  items: T[],
  { page, limit, orderBy, order }: PaginationQuery
): Paginated<T> {
  const sorted = [...items].sort((a, b) => {
    const result = compareValues(a[orderBy], b[orderBy])
    return order === 'asc' ? result : -result
  })

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  const data = sorted.slice(start, start + limit)

  return { data, meta: { total, page, limit, totalPages } }
}

/** Filtro case-insensitive para busca textual em múltiplos campos. */
export function matchesSearch(
  haystacks: (string | null | undefined)[],
  needle?: string
): boolean {
  if (!needle || needle.trim() === '') return true
  const term = needle.trim().toLowerCase()
  return haystacks.some((h) => (h ?? '').toLowerCase().includes(term))
}

/** Converte uma string/CSV simples em ArrayBuffer (para mockar exports). */
export function toArrayBuffer(content: string): ArrayBuffer {
  return new TextEncoder().encode(content).buffer as ArrayBuffer
}
