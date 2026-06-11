import type { SortingState, PaginationState } from '@tanstack/react-table'

export interface BaseQueryParams {
  page: number
  limit: number
  orderBy: string
  order: 'asc' | 'desc'
}

export interface TableState<Q extends BaseQueryParams, E> {
  queryParams: Q
  sorting: SortingState
  pagination: PaginationState
  filterValues: Partial<Q>
  selected: E | null
  showViewModal: boolean
  showUpdateModal: boolean
  showDeleteModal: boolean
  showLabelModal: boolean
}

export type TableAction<Q extends BaseQueryParams, E> =
  | { type: 'SET_QUERY_PARAMS'; payload: Partial<Q> }
  | { type: 'SET_SORTING'; payload: SortingState }
  | { type: 'SET_PAGINATION'; payload: PaginationState }
  | { type: 'SET_FILTERS'; payload: Partial<Q> }
  | { type: 'SET_SELECTED'; payload: E | null }
  | { type: 'SET_VIEW_MODAL'; payload: boolean }
  | { type: 'SET_UPDATE_MODAL'; payload: boolean }
  | { type: 'SET_DELETE_MODAL'; payload: boolean }
  | { type: 'SET_LABEL_MODAL'; payload: boolean }
  | { type: 'CLEAR_FILTERS' }

export function isValidFilterValue(
  value: unknown
): value is string | boolean | string[] | number {
  if (
    value === undefined ||
    value === null ||
    value === '' ||
    value === 'all'
  ) {
    return false
  }

  if (typeof value === 'string') return value.trim() !== ''
  if (typeof value === 'boolean') return true
  if (typeof value === 'number') return !isNaN(value)
  if (Array.isArray(value)) return value.length > 0

  return false
}
