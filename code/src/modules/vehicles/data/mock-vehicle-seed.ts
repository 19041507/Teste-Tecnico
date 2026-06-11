import { mockCompanies } from '@/modules/companies/data/mock-companies'
import { VehicleType } from '@/modules/vehicles/enums/vehicle-type.enum'
import { mockVehicles } from '@/modules/vehicles/mocks/vehicle.mocks'
import type { Vehicle } from '@/modules/vehicles/types/Vehicle/base-vehicle.dto'

const BRANDS_AND_MODELS = [
  ['Chevrolet', 'Onix'],
  ['Fiat', 'Strada'],
  ['Toyota', 'Corolla'],
  ['Renault', 'Master'],
  ['Volkswagen', 'Saveiro'],
  ['Honda', 'Biz 125'],
  ['Iveco', 'Daily'],
  ['Mercedes-Benz', 'Sprinter'],
] as const

const VEHICLE_TYPES = Object.values(VehicleType)

const generatedVehicles: Vehicle[] = Array.from({ length: 28 }, (_, index) => {
  const sequence = index + 5
  const company = mockCompanies[index % mockCompanies.length]
  const [brand, model] = BRANDS_AND_MODELS[index % BRANDS_AND_MODELS.length]
  const createdAt = new Date(2025, 5, 1 + index, 8 + (index % 8), 0, 0)
  const updatedAt = new Date(createdAt)
  updatedAt.setDate(updatedAt.getDate() + (index % 6))

  return {
    id: `veh-${String(sequence).padStart(4, '0')}`,
    plate: `MTR-${String(1000 + sequence).padStart(4, '0')}`,
    brand,
    model,
    year: 2018 + (index % 8),
    vehicleType: VEHICLE_TYPES[index % VEHICLE_TYPES.length],
    isActive: index % 5 !== 0,
    description:
      index % 3 === 0
        ? 'Veículo destinado às atividades operacionais da empresa.'
        : null,
    companyId: company.id,
    company: { id: company.id, tradeName: company.tradeName },
    createdAt,
    updatedAt,
  }
})

/**
 * Base adicional do desafio para permitir avaliar paginação, filtros e
 * indicadores sem modificar os mocks fornecidos pela empresa.
 */
export const vehicleSeed: Vehicle[] = [...mockVehicles, ...generatedVehicles]
