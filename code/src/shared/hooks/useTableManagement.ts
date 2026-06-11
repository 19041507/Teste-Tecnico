'use client'

import { useReducer, useCallback, useMemo } from 'react'
import type { SortingState, PaginationState } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import type {
  BaseQueryParams,
  TableState,
} from '@/shared/table/management/types'
import { createTableReducer } from '@/shared/table/management/tableReducer'

export interface TableMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UseTableManagementOptions<Q extends BaseQueryParams, E> {
  queryKeyPrefix: string
  queryFn: (
    params: Q,
    signal?: AbortSignal
  ) => Promise<{ data: E[]; meta: TableMeta }>
  initialQueryParams: Q
  defaultOrderBy?: string
  defaultOrder?: 'asc' | 'desc'
}

export function useTableManagement<Q extends BaseQueryParams, E>({
  queryKeyPrefix,
  queryFn,
  initialQueryParams,
  defaultOrderBy = 'createdAt',
  defaultOrder = 'desc',
}: UseTableManagementOptions<Q, E>) {
  const initialState: TableState<Q, E> = useMemo(
    () => ({
      queryParams: initialQueryParams,
      sorting: [
        {
          id: initialQueryParams.orderBy,
          desc: initialQueryParams.order === 'desc',
        },
      ],
      pagination: {
        pageIndex: initialQueryParams.page - 1,
        pageSize: initialQueryParams.limit,
      },
      filterValues: {},
      selected: null,
      showViewModal: false,
      showUpdateModal: false,
      showDeleteModal: false,
      showLabelModal: false,
    }),
    [initialQueryParams]
  )

  const reducer = useMemo(
    () => createTableReducer<Q, E>(defaultOrderBy, defaultOrder),
    [defaultOrderBy, defaultOrder]
  )

  const [state, dispatch] = useReducer(reducer, initialState)

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [queryKeyPrefix, state.queryParams],
    queryFn: ({ signal }) => queryFn(state.queryParams, signal),
    placeholderData: (previousData) => previousData,
  })

  const items = data?.data ?? []
  const meta: TableMeta = data?.meta ?? {
    total: 0,
    page: 1,
    limit: initialQueryParams.limit,
    totalPages: 1,
  }

  const setSelected = useCallback((payload: E | null) => {
    dispatch({ type: 'SET_SELECTED', payload })
  }, [])

  const handleUpdate = useCallback((entity: E) => {
    dispatch({ type: 'SET_SELECTED', payload: entity })
    dispatch({ type: 'SET_UPDATE_MODAL', payload: true })
  }, [])

  const handleCloseUpdateModal = useCallback(() => {
    dispatch({ type: 'SET_UPDATE_MODAL', payload: false })
    dispatch({ type: 'SET_SELECTED', payload: null })
  }, [])

  const openDeleteModal = useCallback((entity: E | null) => {
    dispatch({ type: 'SET_SELECTED', payload: entity })
    dispatch({ type: 'SET_DELETE_MODAL', payload: true })
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    dispatch({ type: 'SET_DELETE_MODAL', payload: false })
    dispatch({ type: 'SET_SELECTED', payload: null })
  }, [])

  const handleView = useCallback((entity: E) => {
    dispatch({ type: 'SET_SELECTED', payload: entity })
    dispatch({ type: 'SET_VIEW_MODAL', payload: true })
  }, [])

  const handleCloseViewModal = useCallback(() => {
    dispatch({ type: 'SET_VIEW_MODAL', payload: false })
    dispatch({ type: 'SET_SELECTED', payload: null })
  }, [])

  const handleLabel = useCallback((entity: E) => {
    dispatch({ type: 'SET_SELECTED', payload: entity })
    dispatch({ type: 'SET_LABEL_MODAL', payload: true })
  }, [])

  const handleCloseLabelModal = useCallback(() => {
    dispatch({ type: 'SET_LABEL_MODAL', payload: false })
    dispatch({ type: 'SET_SELECTED', payload: null })
  }, [])

  const handleSortingChange = useCallback((sorting: SortingState) => {
    dispatch({ type: 'SET_SORTING', payload: sorting })
  }, [])

  const handlePaginationChange = useCallback((pagination: PaginationState) => {
    dispatch({ type: 'SET_PAGINATION', payload: pagination })
  }, [])

  const handleFiltersApply = useCallback((filters: Partial<Q>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }, [])

  const handleFilterChange = useCallback(
    (key: string, value: string | boolean | string[] | undefined | null) => {
      dispatch({
        type: 'SET_FILTERS',
        payload: { ...state.filterValues, [key]: value },
      })
    },
    [state.filterValues]
  )

  const handleClearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' })
  }, [])

  return {
    state,
    dispatch,
    items,
    meta,
    isLoading,
    isFetching,
    error,
    setSelected,
    handleUpdate,
    handleCloseUpdateModal,
    openDeleteModal,
    handleCloseDeleteModal,
    handleView,
    handleCloseViewModal,
    handleLabel,
    handleCloseLabelModal,
    handleSortingChange,
    handlePaginationChange,
    handleFiltersApply,
    handleFilterChange,
    handleClearFilters,
  }
}
