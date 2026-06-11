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
import { User } from '@/modules/users/types/User/User/base-user.dto'
import { Badge } from '@/shared/ui/badge'
import { Role, ROLE_BADGE_CLASS } from '@/shared/enums/role.enum'
import { useAbility } from '@/core/permissions/context/AbilityProvider'
import { Can } from '@/core/permissions/context/abilityContext'
import { createColumnHelpers } from '@/shared/table'

const col = createColumnHelpers<User>()


export interface UseUserColumnsActions {
  onUpdate: (user: User) => void
  onDelete: (userId: string) => void
}

export function useUserColumns({
  onUpdate,
  onDelete,
}: UseUserColumnsActions): ColumnDef<User>[] {
  const ability = useAbility()

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
            const user = info.row.original
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
                  <Can I="update" a="User">
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        onUpdate(user)
                      }}
                    >
                      <SquarePen className="h-4 w-4" strokeWidth={2.2} />
                      Editar
                    </DropdownMenuItem>
                  </Can>
                  <Can I="delete" a="User">
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        onDelete(user.id)
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
        col.text('username', {
          header: 'Usuário',
          minSize: 150,
          enableHiding: false,
          visible: true,
        }),
        col.text('name', {
          header: 'Nome Completo',
          minSize: 250,
          enableHiding: false,
          visible: true,
        }),
        col.text('email', {
          header: 'E-mail',
          minSize: 250,
          visible: true,
        }),
        ...(ability.can('manage', 'Company')
          ? [
              col.relation('company', {
                id: 'companyId',
                header: 'Empresa',
                enableHiding: false,
                minSize: 250,
                visible: true,
                valueAccessor: (value: User['company']) => value?.tradeName,
              }),
            ]
          : []),
        col.badge('isActive', {
          header: 'Status',
          minSize: 100,
          visible: true,
          map: {
            true: { label: 'Ativo', variant: 'default' },
            false: { label: 'Inativo', variant: 'outline' },
          },
        }),
        {
          id: 'roles',
          accessorKey: 'roles',
          header: 'Cargos',
          minSize: 200,
          meta: { visible: true },
          cell: (info) => {
            const roles = info.getValue() as Role[]
            return (
              <div className="flex items-center gap-2" title={roles.join(', ')}>
                <Badge className={ROLE_BADGE_CLASS[roles[0]] ?? ''}>
                  {roles[0]}
                </Badge>
                {roles.length > 1 && (
                  <Badge variant="outline">+{roles.length - 1}</Badge>
                )}
              </div>
            )
          },
        },
        col.date('createdAt', {
          header: 'Data de criação',
          minSize: 180,
        }),
        col.date('updatedAt', {
          header: 'Data de Atualização',
          minSize: 180,
        }),
      ] as ColumnDef<User>[],
    [ability, onUpdate, onDelete]
  )
}
