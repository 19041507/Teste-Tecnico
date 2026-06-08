import { flexRender } from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { type Table as ReactTable, type ColumnDef } from '@tanstack/react-table'

interface DataTableProps<T> {
  table: ReactTable<T>
  isLoading?: boolean
  error?: Error | null
  data: T[]
  columns: ColumnDef<T>[]
  emptyMessage?: string
  className?: string
}

export function DataTable<T>({
  table,
  isLoading = false,
  error = null,
  data,
  columns,
  emptyMessage = 'Nenhum registro encontrado',
  className = '',
}: DataTableProps<T>) {
  return (
    <div className={`h-full overflow-x-auto border-y ${className}`}>
      <div
        className="h-full overflow-x-hidden overflow-y-hidden"
        style={{
          width: 'max-content',
          minWidth: '100%',
        }}
      >
        <div className="overflow-y-scroll">
          <Table
            className="table-fixed"
            style={{
              width: 'max-content',
              minWidth: '100%',
            }}
          >
            <TableHeader className="sticky top-0 z-10 overflow-visible [&_tr]:border-b-0">
              <TableRow className="overflow-x-hidden">
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{
                        width: `${header.column.getSize()}px`,
                        minWidth: `${header.column.getSize()}px`,
                        maxWidth: `${header.column.getSize()}px`,
                      }}
                      className={
                        header.column.getCanSort()
                          ? 'cursor-pointer overflow-x-hidden py-4 pr-2 pl-7'
                          : 'cursor-default overflow-x-hidden py-4 pr-2 pl-7'
                      }
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <div className="flex items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="ml-1 h-4 w-4 shrink-0" />
                          ) : (
                            <ChevronUp className="ml-1 h-4 w-4 shrink-0" />
                          )
                        ) : (
                          <div className="ml-1 h-4 w-4 shrink-0" />
                        )}
                      </div>
                    </TableHead>
                  ))
                )}
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        <div className="h-full overflow-y-scroll border-t pb-12">
          <Table
            className="table-fixed"
            style={{
              width: 'max-content',
              minWidth: '100%',
            }}
          >
            <TableBody>
              {isLoading ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="px-7 py-8 text-center"
                  >
                    <div className="flex h-full w-full items-center justify-center">
                      <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="text-destructive px-7 py-8 text-center"
                  >
                    {error.message}
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="text-muted-foreground px-7 py-8 text-center"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={index % 2 === 0 ? 'bg-muted/20 hover:bg-primary/5' : 'hover:bg-primary/5'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="border-b py-1.5 pr-2 pl-7"
                        style={{
                          width: `${cell.column.getSize()}px`,
                          minWidth: `${cell.column.getSize()}px`,
                          maxWidth: `${cell.column.getSize()}px`,
                        }}
                      >
                        <div className="flex min-h-[32px] items-center">
                          <span className="block w-full truncate">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </span>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
