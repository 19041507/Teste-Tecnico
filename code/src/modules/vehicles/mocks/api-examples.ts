/**
 * Payloads de exemplo e shape esperado da API do módulo de Veículos.
 *
 * Material de APOIO ao teste técnico. Estes objetos documentam o contrato de
 * integração que o candidato deve seguir ao implementar o service mockado
 * (espelhando `companies`/`users`).
 */
import { VehicleType } from '../enums/vehicle-type.enum'
import type { CreateVehicleDto } from '../types/Vehicle/create-vehicle.dto'
import type { UpdateVehicleDto } from '../types/Vehicle/update-vehicle.dto'
import type { QueryVehicleDto } from '../types/Vehicle/query-vehicle.dto'

/**
 * POST /vehicles — corpo da requisição de criação.
 * Validado por `createVehicleSchema`.
 */
export const exampleCreateVehiclePayload: CreateVehicleDto = {
  companyId: 'cmp-0001',
  plate: 'MNO-7890',
  brand: 'Toyota',
  model: 'Hilux',
  year: 2023,
  vehicleType: VehicleType.TRUCK,
  isActive: true,
  description: 'Veículo de campo recém-adquirido.',
}

/**
 * PATCH /vehicles/:id — corpo da requisição de atualização (parcial).
 * Validado por `updateVehicleSchema`.
 */
export const exampleUpdateVehiclePayload: UpdateVehicleDto = {
  description: 'Veículo de campo (revisado)',
  isActive: false,
}

/**
 * GET /vehicles — exemplo de query params (paginação/ordenação/filtros).
 * Validado por `queryVehicleSchema`.
 */
export const exampleQueryVehicle: QueryVehicleDto = {
  page: 1,
  limit: 20,
  orderBy: 'createdAt',
  order: 'desc',
  search: '',
  isActive: true,
}

/**
 * Shape de resposta esperado da API de listagem (documentação).
 *   GET /vehicles       ->  { data: Vehicle[]; meta: { total, page, limit, totalPages } }
 *   GET /vehicles/:id   ->  Vehicle
 *   POST /vehicles      ->  Vehicle
 *   PATCH /vehicles/:id ->  Vehicle
 *   DELETE /vehicles/:id -> { id: string }
 */
export const apiResponseShapeReference = {
  list: {
    data: '/* Vehicle[] */',
    meta: { total: 0, page: 1, limit: 20, totalPages: 1 },
  },
} as const
