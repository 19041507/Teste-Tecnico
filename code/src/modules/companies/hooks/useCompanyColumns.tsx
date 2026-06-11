'use client'

import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Ellipsis, Trash2, SquarePen } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/shared/ui/dropdown-menu'
import { Company } from '@/modules/companies/types/Company/Company/base-company.dto'
import { Can } from '@/core/permissions/context/abilityContext'
import { formatCNPJ } from '@/shared/utils/formatters'
import { createColumnHelpers } from '@/shared/table'

const col = createColumnHelpers<Company>()

export interface UseCompanyColumnsActions {
  onUpdate: (company: Company) => void
  onDelete: (companyId: string) => void
}

export function useCompanyColumns({
  onUpdate,
  onDelete,
}: UseCompanyColumnsActions): ColumnDef<Company>[] {
  return useMemo(
    () =>
      [
        {
          id: 'actions',
          accessorKey: 'id',
          header: 'Ações',
          size: 75,
          enableSorting: false,
          enableHiding: false,
          meta: { visible: true },
          cell: (info) => {
            const company = info.row.original
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 cursor-pointer"
                  >
                    <Ellipsis className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <Can I="update" a="Company">
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        onUpdate(company)
                      }}
                    >
                      <SquarePen className="h-4 w-4" strokeWidth={2.2} />
                      Editar
                    </DropdownMenuItem>
                  </Can>
                  <Can I="delete" a="Company">
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        onDelete(company.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                      Excluir
                    </DropdownMenuItem>
                  </Can>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          },
        },
        col.text('registrationNumber', {
          header: 'CNPJ',
          minSize: 150,
          visible: true,
          formatter: (value) => formatCNPJ(value),
        }),
        col.text('legalName', {
          header: 'Razão Social',
          minSize: 250,
          enableHiding: false,
          visible: true,
        }),
        col.text('tradeName', {
          header: 'Nome Fantasia',
          minSize: 250,
          visible: true,
        }),
        col.badge('isActive', {
          header: 'Status',
          minSize: 100,
          visible: true,
          map: {
            true: { label: 'Ativo', variant: 'default' },
            false: { label: 'Inativo', variant: 'outline' },
          },
        }),
        col.date('createdAt', {
          header: 'Data de Criação',
          minSize: 180,
        }),
        col.date('updatedAt', {
          header: 'Data de Atualização',
          minSize: 180,
        }),
      ] as ColumnDef<Company>[],
    [onUpdate, onDelete]
  )
}
