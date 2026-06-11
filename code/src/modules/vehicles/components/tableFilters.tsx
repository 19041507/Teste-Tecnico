'use client'

import { useMemo } from 'react'
import { QueryVehicleDto } from '@/modules/vehicles/types/Vehicle/query-vehicle.dto'
import { VehicleType } from '@/modules/vehicles/enums/vehicle-type.enum'
import { useVehicleFormOptions } from '@/modules/vehicles/hooks/useVehicleFormOptions'
import { enumToOptions } from '@/shared/utils/mappers'
import { TableFilters, FilterField } from '@/shared/ui/table/tableFilters'
import { TableSearchInput } from '@/shared/ui/table/tableSearchInput'
import { SelectCombobox } from '@/shared/ui/select-combobox'

interface VehicleFiltersProps {
  filterValues: Partial<QueryVehicleDto>
  onFilterChange: (
    key: keyof QueryVehicleDto,
    value: string | boolean | undefined | null
  ) => void
  onApplyFilters: (filters: Partial<QueryVehicleDto>) => void
  onClearFilters: () => void
  isFetching?: boolean
}

const YES_NO_OPTIONS = [
  { value: 'true', label: 'Sim' },
  { value: 'false', label: 'Não' },
]

export function VehicleFilters({
  filterValues,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  isFetching = false,
}: VehicleFiltersProps) {
  const { isAdmin, COMPANY_OPTIONS } = useVehicleFormOptions()
  const vehicleTypeOptions = useMemo(() => enumToOptions(VehicleType), [])

  const filterFields: FilterField[] = [
    {
      key: 'companyId',
      type: 'select',
      label: 'Empresa',
      hidden: !isAdmin,
      renderCustom: ({ value, onChange }) => (
        <SelectCombobox
          options={COMPANY_OPTIONS}
          value={value as string | undefined}
          onValueChange={onChange}
          placeholder="Todas as empresas"
          searchPlaceholder="Buscar empresa..."
          showSearch
        />
      ),
    },
    {
      key: 'plate',
      type: 'text',
      label: 'Placa',
      placeholder: 'Ex.: ABC-1234',
      formatter: (value) => value.toUpperCase(),
    },
    {
      key: 'brand',
      type: 'text',
      label: 'Marca',
      placeholder: 'Ex.: Volkswagen',
    },
    {
      key: 'vehicleType',
      type: 'select',
      label: 'Tipo de Veículo',
      options: vehicleTypeOptions,
      placeholder: 'Todos os tipos',
    },
    {
      key: 'isActive',
      type: 'select',
      label: 'Ativo',
      options: YES_NO_OPTIONS,
      placeholder: 'Todos',
    },
  ]

  return (
    <div className="flex w-full items-center gap-4">
      <TableSearchInput
        committedSearchValue={filterValues.search}
        onSearchCommit={(value) => onFilterChange('search', value)}
        isFetching={isFetching}
        placeholder="Buscar por placa, marca, modelo ou empresa"
      />

      <div className="ml-auto">
        <TableFilters
          filterValues={filterValues}
          filterFields={filterFields}
          onFilterChange={onFilterChange}
          onApplyFilters={onApplyFilters}
          onClearFilters={onClearFilters}
          description="Refine a listagem por empresa, identificação, tipo e situação do veículo."
        />
      </div>
    </div>
  )
}
