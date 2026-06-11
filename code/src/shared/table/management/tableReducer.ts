import type {
  BaseQueryParams,
  TableState,
  TableAction,
} from './types'
import { isValidFilterValue } from './types'

const DEFAULT_ORDER_BY = 'createdAt'
const DEFAULT_ORDER = 'desc' as const

export function createTableReducer<Q extends BaseQueryParams, E>(
  defaultOrderBy: string = DEFAULT_ORDER_BY,
  defaultOrder: 'asc' | 'desc' = DEFAULT_ORDER
) {
  return function tableReducer(
    state: TableState<Q, E>,
    action: TableAction<Q, E>
  ): TableState<Q, E> {
    switch (action.type) {
      case 'SET_QUERY_PARAMS':
        return {
          ...state,
          queryParams: { ...state.queryParams, ...action.payload },
        }

      case 'SET_SORTING': {
        const newSorting = action.payload
        const sortColumn = newSorting[0]?.id ?? defaultOrderBy
        const sortDirection = newSorting[0]?.desc ? 'desc' : 'asc'
        return {
          ...state,
          sorting: newSorting,
          queryParams: {
            ...state.queryParams,
            orderBy: sortColumn as Q['orderBy'],
            order: sortDirection,
          },
        }
      }

      case 'SET_PAGINATION':
        return {
          ...state,
          pagination: action.payload,
          queryParams: {
            ...state.queryParams,
            page: action.payload.pageIndex + 1,
            limit: action.payload.pageSize,
          },
        }

      case 'SET_FILTERS': {
        const validFilters = Object.fromEntries(
          Object.entries(action.payload).filter(([, value]) =>
            isValidFilterValue(value)
          )
        ) as Partial<Q>
        return {
          ...state,
          filterValues: action.payload,
          pagination: { ...state.pagination, pageIndex: 0 },
          queryParams: {
            ...validFilters,
            page: 1,
            limit: state.queryParams.limit,
            orderBy: state.queryParams.orderBy,
            order: state.queryParams.order,
          } as Q,
        }
      }

      case 'CLEAR_FILTERS': {
        const search = (state.filterValues as Record<string, unknown>)?.search
        return {
          ...state,
          filterValues: (search !== undefined ? { search } : {}) as Partial<Q>,
          pagination: { ...state.pagination, pageIndex: 0 },
          queryParams: {
            ...(search !== undefined ? { search } : {}),
            page: 1,
            limit: state.queryParams.limit,
            orderBy: defaultOrderBy as Q['orderBy'],
            order: defaultOrder,
          } as Q,
        }
      }

      case 'SET_SELECTED':
        return { ...state, selected: action.payload }

      case 'SET_VIEW_MODAL':
        return { ...state, showViewModal: action.payload }

      case 'SET_UPDATE_MODAL':
        return { ...state, showUpdateModal: action.payload }

      case 'SET_DELETE_MODAL':
        return { ...state, showDeleteModal: action.payload }

      case 'SET_LABEL_MODAL':
        return { ...state, showLabelModal: action.payload }

      default:
        return state
    }
  }
}
