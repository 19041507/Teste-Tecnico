'use client'

import { useMemo } from 'react'
import { useCompanyFormOptions } from '@/modules/companies'
import { VehicleType } from '@/modules/vehicles/enums/vehicle-type.enum'
import { enumToOptions } from '@/shared/utils/mappers'

export function useVehicleFormOptions(initialCompanyId?: string | null) {
  const companyOptions = useCompanyFormOptions(initialCompanyId)

  const VEHICLE_TYPE_OPTIONS = useMemo(() => enumToOptions(VehicleType), [])

  return {
    ...companyOptions,
    VEHICLE_TYPE_OPTIONS,
  }
}
