'use client'

import { useCallback } from 'react'
import {
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
} from '@tanstack/react-table'
import { getUsers } from '@/modules/users/services/userService'
import { QueryUserDto } from '@/modules/users/types/User/User/query-user.dto'
import { User } from '@/modules/users/types/User/User/base-user.dto'
import { UserFilters } from './tableFilters'
import { ColumnVisibility } from '@/shared/ui/table/columnVisibility'
import UpdateUserButton from './updateButton'
import DeleteUserButton from './deleteButton'
import { Card, CardFooter, CardHeader } from '@/shared/ui/card'
import { Pagination } from '@/shared/ui/table/pagination'
import { DataTable } from '@/shared/ui/table/dataTable'
import { getInitialVisibility } from '@/shared/table'
import { useTableManagement } from '@/shared/hooks/useTableManagement'
import { useUserColumns } from '@/modules/users/hooks/useUserColumns'

const initialQueryParams: QueryUserDto = {
  page: 1,
  limit: 20,
  orderBy: 'createdAt',
  order: 'desc',
}

export default function UserManagement() {
  const {
    state,
    items: users,
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
  } = useTableManagement<QueryUserDto, User>({
    queryKeyPrefix: 'users',
    queryFn: getUsers,
    initialQueryParams,
  })

  const handleUserDelete = useCallback(
    (userId: string) => {
      openDeleteModal(users.find((u) => u.id === userId) ?? null)
    },
    [users, openDeleteModal]
  )

  const columns = useUserColumns({
    onUpdate: handleUpdate,
    onDelete: handleUserDelete,
  })

  const table = useReactTable({
    data: users,
    columns,
    initialState: {
      columnVisibility: getInitialVisibility(columns as ColumnDef<User>[]),
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
          <UserFilters
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
        data={users}
        columns={columns as ColumnDef<User>[]}
        emptyMessage="Nenhum usuário encontrado"
      />

      {state.showUpdateModal && state.selected && (
        <UpdateUserButton
          user={state.selected}
          onClose={handleCloseUpdateModal}
        />
      )}

      {state.showDeleteModal && state.selected && (
        <DeleteUserButton
          userId={state.selected.id}
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
