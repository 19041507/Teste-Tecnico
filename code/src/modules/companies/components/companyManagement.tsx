'use client'

import { useCallback } from 'react'
import {
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
} from '@tanstack/react-table'
import { getCompanies } from '@/modules/companies/services/companyService'
import { QueryCompanyDto } from '@/modules/companies/types/Company/Company/query-company.dto'
import { Company } from '@/modules/companies/types/Company/Company/base-company.dto'
import { CompanyFilters } from './tableFilters'
import DeleteCompanyButton from './deleteButton'
import { Card, CardFooter, CardHeader } from '@/shared/ui/card'
import { Pagination } from '@/shared/ui/table/pagination'
import { ColumnVisibility } from '@/shared/ui/table/columnVisibility'
import { DataTable } from '@/shared/ui/table/dataTable'
import UpdateCompanyButton from './updateButton'
import { getInitialVisibility } from '@/shared/table'
import { useTableManagement } from '@/shared/hooks/useTableManagement'
import { useCompanyColumns } from '@/modules/companies/hooks/useCompanyColumns'

const initialQueryParams: QueryCompanyDto = {
  page: 1,
  limit: 20,
  orderBy: 'createdAt',
  order: 'desc',
}

export default function CompanyManagement() {
  const {
    state,
    items: companies,
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
    handleFilterChange,
    handleFiltersApply,
    handleClearFilters,
  } = useTableManagement<QueryCompanyDto, Company>({
    queryKeyPrefix: 'companies',
    queryFn: getCompanies,
    initialQueryParams,
  })

  const handleCompanyDelete = useCallback(
    (companyId: string) => {
      openDeleteModal(companies.find((c) => c.id === companyId) ?? null)
    },
    [companies, openDeleteModal]
  )

  const columns = useCompanyColumns({
    onUpdate: handleUpdate,
    onDelete: handleCompanyDelete,
  })

  const table = useReactTable({
    data: companies,
    columns,
    initialState: {
      columnVisibility: getInitialVisibility(columns as ColumnDef<Company>[]),
    },
    state: {
      sorting: state.sorting,
      pagination: state.pagination,
    },
    autoResetPageIndex: false,
    manualPagination: true,
    manualSorting: true,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === 'function' ? updater(state.sorting) : updater
      handleSortingChange(newSorting)
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater(state.pagination) : updater
      handlePaginationChange(newPagination)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount: meta.totalPages,
  })

  return (
    <Card className="h-full justify-between gap-4 overflow-hidden pt-5 pb-4">
      <CardHeader className="flex flex-col gap-4 px-5 pb-1 lg:flex-row">
        <div className="flex w-full">
          <CompanyFilters
            filterValues={state.filterValues}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleFiltersApply}
            onClearFilters={handleClearFilters}
            isFetching={isFetching}
          />

          <div className="ml-4 xl:border-l xl:pl-4">
            <ColumnVisibility table={table} align="end" />
          </div>
        </div>
      </CardHeader>

      <DataTable
        table={table}
        isLoading={isLoading}
        error={error as Error | null}
        data={companies}
        columns={columns as ColumnDef<Company>[]}
        emptyMessage="Nenhuma empresa encontrada"
      />

      {state.showUpdateModal && state.selected && (
        <UpdateCompanyButton
          company={state.selected}
          onClose={handleCloseUpdateModal}
        />
      )}

      {state.showDeleteModal && state.selected && (
        <DeleteCompanyButton
          companyId={state.selected.id}
          onClose={handleCloseDeleteModal}
        />
      )}

      <CardFooter className="px-5">
        <Pagination
          currentPage={state.pagination.pageIndex + 1}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          itemsPerPage={state.pagination.pageSize}
          onPageChange={(page) =>
            handlePaginationChange({
              ...state.pagination,
              pageIndex: page - 1,
            })
          }
        />
      </CardFooter>
    </Card>
  )
}
