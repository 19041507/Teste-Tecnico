'use client'

import { Table } from '@tanstack/react-table'
import { Columns3 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'

interface ColumnVisibilityProps<TData> {
  table: Table<TData>
  triggerText?: string
  align?: 'start' | 'center' | 'end'
}

export function ColumnVisibility<TData>({
  table,
  triggerText,
  align = 'start',
}: ColumnVisibilityProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Columns3 className="h-4 w-4" />
          {triggerText && (
            <span className="ml-2 hidden xl:inline">{triggerText}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="max-h-60 overflow-y-auto">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onSelect={(event) => {
                  event.preventDefault()
                  column.toggleVisibility(!column.getIsVisible())
                }}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.columnDef.header?.toString()}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
