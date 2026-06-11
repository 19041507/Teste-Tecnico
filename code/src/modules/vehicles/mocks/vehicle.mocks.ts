/**
 * Mocks do módulo de Veículos (vehicles).
 *
 * Estes objetos são fornecidos como APOIO ao teste técnico. Use-os para
 * construir o service mockado, a listagem e o formulário do módulo,
 * espelhando o que já existe em `companies` e `users`.
 *
 * Os objetos abaixo são válidos contra `vehicleSchema`
 * (src/modules/vehicles/types/Vehicle/base-vehicle.dto.ts).
 */
import { VehicleType } from '../enums/vehicle-type.enum'
import type { Vehicle } from '../types/Vehicle/base-vehicle.dto'

/**
 * Lista de veículos mockados.
 * `companyId` referencia empresas de `src/modules/companies/data/mock-companies.ts`.
 */
export const mockVehicles: Vehicle[] = [
  {
    id: 'veh-0001',
    plate: 'ABC-1234',
    brand: 'Volkswagen',
    model: 'Gol',
    year: 2020,
    vehicleType: VehicleType.CAR,
    isActive: true,
    description: 'Veículo de uso administrativo.',
    companyId: 'cmp-0001',
    company: { id: 'cmp-0001', tradeName: 'Águas do Vale' },
    createdAt: new Date('2025-01-10T12:00:00.000Z'),
    updatedAt: new Date('2025-01-20T12:00:00.000Z'),
  },
  {
    id: 'veh-0002',
    plate: 'DEF-5678',
    brand: 'Ford',
    model: 'Transit',
    year: 2021,
    vehicleType: VehicleType.VAN,
    isActive: true,
    description: null,
    companyId: 'cmp-0001',
    company: { id: 'cmp-0001', tradeName: 'Águas do Vale' },
    createdAt: new Date('2025-02-01T09:30:00.000Z'),
    updatedAt: new Date('2025-02-01T09:30:00.000Z'),
  },
  {
    id: 'veh-0003',
    plate: 'GHI-9012',
    brand: 'Honda',
    model: 'CG 160',
    year: 2022,
    vehicleType: VehicleType.MOTORCYCLE,
    isActive: false,
    description: 'Moto para entregas rápidas.',
    companyId: 'cmp-0002',
    company: { id: 'cmp-0002', tradeName: 'Hidrosul Saneamento' },
    createdAt: new Date('2025-03-12T15:45:00.000Z'),
    updatedAt: new Date('2025-04-02T10:00:00.000Z'),
  },
  {
    id: 'veh-0004',
    plate: 'JKL-3456',
    brand: 'Mercedes-Benz',
    model: 'Actros',
    year: 2019,
    vehicleType: VehicleType.TRUCK,
    isActive: true,
    description: null,
    companyId: 'cmp-0003',
    company: { id: 'cmp-0003', tradeName: 'Saneadora Litoral' },
    createdAt: new Date('2025-05-21T08:00:00.000Z'),
    updatedAt: new Date('2025-05-21T08:00:00.000Z'),
  },
]

/**
 * Exemplo de resposta paginada da API de listagem.
 * É EXATAMENTE o shape que `useTableManagement` espera do `queryFn`:
 *   { data: Vehicle[]; meta: { total, page, limit, totalPages } }
 */
export const mockVehiclesPaginatedResponse: {
  data: Vehicle[]
  meta: { total: number; page: number; limit: number; totalPages: number }
} = {
  data: mockVehicles,
  meta: {
    total: mockVehicles.length,
    page: 1,
    limit: 20,
    totalPages: 1,
  },
}

/**
 * Lista enxuta (para selects/combos), no padrão de `getCompaniesList`.
 */
export const mockVehiclesList: { id: string; plate: string }[] =
  mockVehicles.map((v) => ({
    id: v.id,
    plate: v.plate,
  }))
