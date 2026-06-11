import { TableFilters, FilterField } from '@/shared/ui/table/tableFilters'
import { SelectCombobox } from '@/shared/ui/select-combobox'
import { useCompanyFormOptions } from '@/modules/companies'
import { enumToOptions } from '@/shared/utils/mappers'
import { useMemo } from 'react'
import { QueryUserDto } from '@/modules/users/types/User/User/query-user.dto'
import { Role } from '@/shared/enums/role.enum'
import { TableSearchInput } from '@/shared/ui/table/tableSearchInput'
import { isCompanyRole } from '@/shared/utils/roleUtils'

interface UserFiltersProps {
  filterValues: Partial<QueryUserDto>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange: (key: keyof QueryUserDto, value: any) => void
  onApplyFilters: (filters: Partial<QueryUserDto>) => void
  onClearFilters: () => void
  isFetching?: boolean
}

export const YES_NO_OPTIONS: { value: string; label: string }[] = [
  { value: 'true', label: 'Sim' },
  { value: 'false', label: 'Não' },
]

export function UserFilters({
  filterValues,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  isFetching = false,
}: UserFiltersProps) {
  const { isAdmin, COMPANY_OPTIONS } = useCompanyFormOptions()

  const ROLE_OPTIONS = useMemo(() => {
    const options = enumToOptions(Role)

    if (isAdmin) {
      return options
    }

    return options.filter((opt) => {
      const role = opt.value as Role

      if (role === Role.MANAGER) {
        return true
      }

      return isCompanyRole(role)
    })
  }, [isAdmin])

  const filterFields: FilterField[] = [
    {
      key: 'companyId',
      type: 'select',
      label: 'Empresa',
      hidden: !isAdmin,
      renderCustom: ({ value, onChange }) => (
        <SelectCombobox
          options={COMPANY_OPTIONS}
          value={value}
          onValueChange={onChange}
          showSearch={true}
        />
      ),
    },
    { key: 'username', type: 'text', label: 'Usuário' },
    { key: 'name', type: 'text', label: 'Nome Completo' },
    { key: 'email', type: 'text', label: 'E-mail' },
    {
      key: 'isActive',
      type: 'select',
      label: 'Ativo',
      options: YES_NO_OPTIONS,
    },
    {
      key: 'roles',
      type: 'multi-select-without-search',
      label: 'Cargos',
      options: ROLE_OPTIONS,
    },
  ]

  return (
    <div className="flex w-full items-center gap-4">
      <TableSearchInput
        committedSearchValue={filterValues.search as string | undefined}
        onSearchCommit={(v) => onFilterChange('search', v)}
        isFetching={isFetching}
      />

      <div className="ml-auto">
        <TableFilters
          filterValues={filterValues}
          filterFields={filterFields}
          onFilterChange={onFilterChange}
          onApplyFilters={onApplyFilters}
          onClearFilters={onClearFilters}
          description="Refine sua busca utilizando os filtros abaixo"
        />
      </div>
    </div>
  )
}
