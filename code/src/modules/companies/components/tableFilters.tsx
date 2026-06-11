import { TableFilters, FilterField } from '@/shared/ui/table/tableFilters'
import { TableSearchInput } from '@/shared/ui/table/tableSearchInput'
import { QueryCompanyDto } from '@/modules/companies/types/Company/Company/query-company.dto'
import { formatCNPJ } from '@/shared/utils/formatters'

const YES_NO_OPTIONS: { value: string; label: string }[] = [
  { value: 'true', label: 'Sim' },
  { value: 'false', label: 'Não' },
]

interface CompanyFiltersProps {
  filterValues: Partial<QueryCompanyDto>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange: (key: keyof QueryCompanyDto, value: any) => void
  onApplyFilters: (filters: Partial<QueryCompanyDto>) => void
  onClearFilters: () => void
  isFetching?: boolean
}

export function CompanyFilters({
  filterValues,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  isFetching = false,
}: CompanyFiltersProps) {
  const filterFields: FilterField[] = [
    {
      key: 'registrationNumber',
      type: 'text',
      label: 'CNPJ',
      formatter: (value: string) => formatCNPJ(value),
    },
    { key: 'legalName', type: 'text', label: 'Razão Social' },
    { key: 'tradeName', type: 'text', label: 'Nome Fantasia' },
    { key: 'isActive', type: 'select', label: 'Ativo', options: YES_NO_OPTIONS },
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
