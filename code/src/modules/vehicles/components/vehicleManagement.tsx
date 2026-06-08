'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table'
import { Vehicle } from '@/modules/vehicles/types/Vehicle/base-vehicle.dto'
import {
  QueryVehicleDto,
  queryVehicleSchema,
} from '@/modules/vehicles/types/Vehicle/query-vehicle.dto'
import { getVehicles } from '@/modules/vehicles/services/vehicleService'
import { useVehicleColumns } from '@/modules/vehicles/hooks/useVehicleColumns'
import { useTableManagement } from '@/shared/hooks/useTableManagement'
import { getInitialVisibility } from '@/shared/table'
import { Card, CardFooter, CardHeader } from '@/shared/ui/card'
import { ColumnVisibility } from '@/shared/ui/table/columnVisibility'
import { DataTable } from '@/shared/ui/table/dataTable'
import { Pagination } from '@/shared/ui/table/pagination'
import { VehicleFilters } from './tableFilters'
import UpdateVehicleButton from './updateButton'
import DeleteVehicleButton from './deleteButton'
import VehicleDetailsSheet from './vehicleDetailsSheet'
import { VehicleBulkActions } from './vehicleBulkActions'
import {
  VehicleTableEmpty,
  VehicleTableError,
  VehicleTableLoading,
} from './vehicleTableState'

const DEFAULT_QUERY_PARAMS: QueryVehicleDto = {
  page: 1,
  limit: 20,
  orderBy: 'createdAt',
  order: 'desc',
}

const FILTER_KEYS: Array<keyof QueryVehicleDto> = [
  'search',
  'companyId',
  'plate',
  'brand',
  'vehicleType',
  'isActive',
]

function parseInitialQuery(searchParams: URLSearchParams): QueryVehicleDto {
  const candidate = {
    page: searchParams.get('page') ?? DEFAULT_QUERY_PARAMS.page,
    limit: searchParams.get('limit') ?? DEFAULT_QUERY_PARAMS.limit,
    orderBy: searchParams.get('orderBy') ?? DEFAULT_QUERY_PARAMS.orderBy,
    order: searchParams.get('order') ?? DEFAULT_QUERY_PARAMS.order,
    search: searchParams.get('search') || undefined,
    companyId: searchParams.get('companyId') || undefined,
    plate: searchParams.get('plate') || undefined,
    brand: searchParams.get('brand') || undefined,
    vehicleType: searchParams.get('vehicleType') || undefined,
    isActive: searchParams.get('isActive') ?? undefined,
  }

  const parsed = queryVehicleSchema.safeParse(candidate)
  return parsed.success ? parsed.data : DEFAULT_QUERY_PARAMS
}

function getFilterValues(query: QueryVehicleDto): Partial<QueryVehicleDto> {
  return FILTER_KEYS.reduce<Partial<QueryVehicleDto>>((filters, key) => {
    const value = query[key]

    if (value !== undefined && value !== null && value !== '') {
      Object.assign(filters, { [key]: value })
    }

    return filters
  }, {})
}

function buildSearchParams(
  query: QueryVehicleDto,
  vehicleId: string | null
): URLSearchParams {
  const params = new URLSearchParams()

  if (query.page !== DEFAULT_QUERY_PARAMS.page) {
    params.set('page', String(query.page))
  }
  if (query.limit !== DEFAULT_QUERY_PARAMS.limit) {
    params.set('limit', String(query.limit))
  }
  if (query.orderBy !== DEFAULT_QUERY_PARAMS.orderBy) {
    params.set('orderBy', query.orderBy)
  }
  if (query.order !== DEFAULT_QUERY_PARAMS.order) {
    params.set('order', query.order)
  }

  for (const key of FILTER_KEYS) {
    const value = query[key]
    if (value === undefined || value === null || value === '') continue
    params.set(key, String(value))
  }

  if (vehicleId) params.set('vehicleId', vehicleId)

  return params
}

export default function VehicleManagement() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [initialQueryParams] = useState(() =>
    parseInitialQuery(new URLSearchParams(searchParams.toString()))
  )
  const [viewVehicleId, setViewVehicleId] = useState<string | null>(() =>
    searchParams.get('vehicleId')
  )
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const {
    state,
    items: vehicles,
    meta,
    isLoading,
    isFetching,
    error,
    handleUpdate,
    handleCloseUpdateModal,
    openDeleteModal,
    handleCloseDeleteModal,
    handleSortingChange,
    handlePaginationChange,
    handleFiltersApply,
  } = useTableManagement<QueryVehicleDto, Vehicle>({
    queryKeyPrefix: 'vehicles',
    queryFn: getVehicles,
    initialQueryParams,
  })

  const filterValues = useMemo(
    () => getFilterValues(state.queryParams),
    [state.queryParams]
  )

  const hasFilters = Object.keys(filterValues).length > 0
  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection]
  )

  useEffect(() => {
    const currentPage = state.pagination.pageIndex + 1

    if (!isLoading && currentPage > meta.totalPages) {
      handlePaginationChange({
        ...state.pagination,
        pageIndex: Math.max(0, meta.totalPages - 1),
      })
    }
  }, [handlePaginationChange, isLoading, meta.totalPages, state.pagination])

  useEffect(() => {
    const nextParams = buildSearchParams(state.queryParams, viewVehicleId)
    const nextSearch = nextParams.toString()
    const currentSearch = searchParams.toString()

    if (nextSearch === currentSearch) return

    router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname, {
      scroll: false,
    })
  }, [pathname, router, searchParams, state.queryParams, viewVehicleId])

  const handleView = useCallback((vehicle: Vehicle) => {
    setViewVehicleId(vehicle.id)
  }, [])

  const handleVehicleDelete = useCallback(
    (vehicleId: string) => {
      openDeleteModal(
        vehicles.find((vehicle) => vehicle.id === vehicleId) ?? null
      )
    },
    [openDeleteModal, vehicles]
  )

  const handleDetailsEdit = useCallback(
    (vehicle: Vehicle) => {
      setViewVehicleId(null)
      handleUpdate(vehicle)
    },
    [handleUpdate]
  )

  const handleFilterChange = useCallback(
    (
      key: keyof QueryVehicleDto,
      value: string | boolean | undefined | null
    ) => {
      handleFiltersApply({
        ...filterValues,
        [key]: value,
      })
      setRowSelection({})
    },
    [filterValues, handleFiltersApply]
  )

  const handleApplyFilters = useCallback(
    (filters: Partial<QueryVehicleDto>) => {
      handleFiltersApply(filters)
      setRowSelection({})
    },
    [handleFiltersApply]
  )

  const handleClearAdvancedFilters = useCallback(() => {
    handleFiltersApply(
      filterValues.search ? { search: filterValues.search } : {}
    )
    setRowSelection({})
  }, [filterValues.search, handleFiltersApply])

  const handleClearAllFilters = useCallback(() => {
    handleFiltersApply({})
    setRowSelection({})
  }, [handleFiltersApply])

  const handleRetry = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['vehicles'] })
  }, [queryClient])

  const columns = useVehicleColumns({
    onView: handleView,
    onUpdate: handleUpdate,
    onDelete: handleVehicleDelete,
  })

  const table = useReactTable({
    data: vehicles,
    columns,
    initialState: {
      columnVisibility: getInitialVisibility(
        columns as ColumnDef<Vehicle, unknown>[]
      ),
    },
    state: {
      sorting: state.sorting,
      pagination: state.pagination,
      rowSelection,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    autoResetPageIndex: false,
    manualPagination: true,
    manualSorting: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      const sorting =
        typeof updater === 'function' ? updater(state.sorting) : updater
      handleSortingChange(sorting)
    },
    onPaginationChange: (updater) => {
      const pagination =
        typeof updater === 'function' ? updater(state.pagination) : updater
      handlePaginationChange(pagination)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount: meta.totalPages,
  })

  return (
    <Card className="h-full min-h-0 justify-between gap-0 overflow-hidden py-0">
      <CardHeader className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row">
        <div className="flex w-full min-w-0 items-center gap-3">
          <VehicleFilters
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearAdvancedFilters}
            isFetching={isFetching}
          />

          <div className="ml-auto shrink-0 border-l pl-3 sm:pl-4">
            <ColumnVisibility table={table} align="end" />
          </div>
        </div>
      </CardHeader>

      <VehicleBulkActions
        selectedIds={selectedIds}
        onClearSelection={() => setRowSelection({})}
      />

      <div className="min-h-0 flex-1">
        {isLoading ? (
          <VehicleTableLoading />
        ) : error ? (
          <VehicleTableError onRetry={handleRetry} />
        ) : vehicles.length === 0 ? (
          <VehicleTableEmpty
            hasFilters={hasFilters}
            onClearFilters={handleClearAllFilters}
          />
        ) : (
          <DataTable
            table={table}
            isLoading={false}
            error={null}
            data={vehicles}
            columns={columns as ColumnDef<Vehicle, unknown>[]}
            emptyMessage="Nenhum veículo encontrado"
          />
        )}
      </div>

      {viewVehicleId && (
        <VehicleDetailsSheet
          vehicleId={viewVehicleId}
          onClose={() => setViewVehicleId(null)}
          onEdit={handleDetailsEdit}
        />
      )}

      {state.showUpdateModal && state.selected && (
        <UpdateVehicleButton
          vehicle={state.selected}
          onClose={handleCloseUpdateModal}
        />
      )}

      {state.showDeleteModal && state.selected && (
        <DeleteVehicleButton
          vehicleId={state.selected.id}
          plate={state.selected.plate}
          onClose={handleCloseDeleteModal}
        />
      )}

      {!isLoading && !error && meta.total > 0 && (
        <CardFooter className="border-t px-4 py-4 sm:px-5">
          <Pagination
            currentPage={state.pagination.pageIndex + 1}
            totalPages={meta.totalPages}
            totalItems={meta.total}
            itemsPerPage={state.pagination.pageSize}
            onPageChange={(page) => {
              handlePaginationChange({
                ...state.pagination,
                pageIndex: page - 1,
              })
            }}
            itemLabel="veículo"
            itemLabelPlural="veículos"
          />
        </CardFooter>
      )}

      <span className="sr-only" aria-live="polite">
        {isFetching && !isLoading ? 'Atualizando lista de veículos' : ''}
      </span>
    </Card>
  )
}
