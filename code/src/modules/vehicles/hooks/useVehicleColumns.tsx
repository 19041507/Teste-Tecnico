'use client'

import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Ellipsis, Eye, SquarePen, Trash2 } from 'lucide-react'
import type { Vehicle } from '@/modules/vehicles/types/Vehicle/base-vehicle.dto'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { useAbility } from '@/core/permissions/context/AbilityProvider'
import { createColumnHelpers } from '@/shared/table'

const col = createColumnHelpers<Vehicle>()

interface UseVehicleColumnsActions {
  onView: (vehicle: Vehicle) => void
  onUpdate: (vehicle: Vehicle) => void
  onDelete: (vehicleId: string) => void
}

export function useVehicleColumns({
  onView,
  onUpdate,
  onDelete,
}: UseVehicleColumnsActions): ColumnDef<Vehicle>[] {
  const ability = useAbility()

  return useMemo(
    () =>
      [
        col.display({
          id: 'select',
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(Boolean(value))
              }
              aria-label="Selecionar todos os veículos desta página"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
              aria-label={`Selecionar veículo ${row.original.plate}`}
            />
          ),
          size: 52,
          enableSorting: false,
          enableHiding: false,
          meta: { visible: true },
        }),
        col.display({
          id: 'actions',
          header: 'Ações',
          size: 75,
          enableSorting: false,
          enableHiding: false,
          meta: { visible: true },
          cell: ({ row }) => {
            const vehicle = row.original

            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 cursor-pointer"
                    aria-label={`Abrir ações do veículo ${vehicle.plate}`}
                  >
                    <Ellipsis className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault()
                      onView(vehicle)
                    }}
                  >
                    <Eye className="h-4 w-4" strokeWidth={2.2} />
                    Visualizar detalhes
                  </DropdownMenuItem>

                  {ability.can('update', 'Vehicle') && (
                    <DropdownMenuItem
                      onSelect={(event) => {
                        event.preventDefault()
                        onUpdate(vehicle)
                      }}
                    >
                      <SquarePen className="h-4 w-4" strokeWidth={2.2} />
                      Editar
                    </DropdownMenuItem>
                  )}

                  {ability.can('delete', 'Vehicle') && (
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={(event) => {
                        event.preventDefault()
                        onDelete(vehicle.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                      Excluir
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          },
        }),
        {
          id: 'plate',
          accessorKey: 'plate',
          header: 'Placa',
          minSize: 135,
          enableHiding: false,
          meta: { visible: true },
          cell: ({ row }) => (
            <Button
              variant="link"
              className="h-auto p-0 font-semibold uppercase"
              onClick={() => onView(row.original)}
              aria-label={`Visualizar detalhes do veículo ${row.original.plate}`}
            >
              {row.original.plate}
            </Button>
          ),
        } satisfies ColumnDef<Vehicle>,
        col.text('brand', {
          header: 'Marca',
          minSize: 150,
          visible: true,
        }),
        col.text('model', {
          header: 'Modelo',
          minSize: 170,
          enableHiding: false,
          visible: true,
        }),
        col.text('year', {
          header: 'Ano',
          minSize: 90,
          visible: true,
        }),
        col.text('vehicleType', {
          header: 'Tipo',
          minSize: 130,
          visible: true,
        }),
        col.relation('company', {
          id: 'companyId',
          header: 'Empresa',
          minSize: 190,
          visible: true,
          valueAccessor: (company: Vehicle['company']) => company.tradeName,
        }),
        col.badge('isActive', {
          header: 'Status',
          minSize: 110,
          visible: true,
          map: {
            true: { label: 'Ativo', variant: 'default' },
            false: { label: 'Inativo', variant: 'outline' },
          },
        }),
        col.date('updatedAt', {
          header: 'Atualizado em',
          minSize: 145,
          visible: false,
          formatStr: 'dd/MM/yyyy',
        }),
      ] as ColumnDef<Vehicle>[],
    [ability, onDelete, onUpdate, onView]
  )
}
