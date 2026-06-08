/**
 * Service de Vehicle — versão MOCKADA (sem backend).
 *
 * Mantém a mesma API pública dos demais módulos e opera sobre datastores
 * mutáveis em memória. Em uma integração real, estas funções seriam
 * substituídas por chamadas HTTP usando `@/core/http/axios`.
 */
import {
  QueryVehicleDto,
  queryVehicleSchema,
} from '@/modules/vehicles/types/Vehicle/query-vehicle.dto'
import {
  CreateVehicleDto,
  createVehicleSchema,
} from '@/modules/vehicles/types/Vehicle/create-vehicle.dto'
import {
  UpdateVehicleDto,
  updateVehicleSchema,
} from '@/modules/vehicles/types/Vehicle/update-vehicle.dto'
import type { Vehicle } from '@/modules/vehicles/types/Vehicle/base-vehicle.dto'
import type {
  VehicleHistoryChange,
  VehicleHistoryEntry,
} from '@/modules/vehicles/types/Vehicle/vehicle-history.dto'
import { vehicleSeed } from '@/modules/vehicles/data/mock-vehicle-seed'
import { getCompaniesList } from '@/modules/companies/services/companyService'
import {
  delay,
  genId,
  matchesSearch,
  paginate,
  toArrayBuffer,
} from '@/shared/mocks/mock-store'

const cloneVehicle = (vehicle: Vehicle): Vehicle => ({
  ...vehicle,
  company: { ...vehicle.company },
  createdAt: new Date(vehicle.createdAt),
  updatedAt: new Date(vehicle.updatedAt),
})

const buildInitialHistory = (vehicles: Vehicle[]): VehicleHistoryEntry[] =>
  vehicles.map((vehicle) => ({
    id: `hist-${vehicle.id}-created`,
    vehicleId: vehicle.id,
    plate: vehicle.plate,
    action: 'created',
    title: 'Veículo cadastrado',
    description: `${vehicle.brand} ${vehicle.model} foi adicionado à frota.`,
    changes: [],
    createdAt: new Date(vehicle.createdAt),
  }))

const store: Vehicle[] = vehicleSeed.map(cloneVehicle)
const historyStore: VehicleHistoryEntry[] = buildInitialHistory(store)

function normalizePlate(plate: string): string {
  return plate.trim().toUpperCase()
}

async function resolveCompany(
  companyId?: string | null
): Promise<Vehicle['company']> {
  if (!companyId) {
    throw {
      statusCode: 400,
      message: 'Empresa é obrigatória.',
    }
  }

  const { data: companies } = await getCompaniesList()
  const company = companies.find((item) => item.id === companyId)

  if (!company) {
    throw {
      statusCode: 400,
      message: 'A empresa selecionada não foi encontrada.',
    }
  }

  return { id: company.id, tradeName: company.tradeName }
}

function ensureUniquePlate(plate: string, ignoredVehicleId?: string) {
  const exists = store.some(
    (vehicle) =>
      vehicle.id !== ignoredVehicleId &&
      normalizePlate(vehicle.plate) === normalizePlate(plate)
  )

  if (exists) {
    throw {
      statusCode: 409,
      message: 'Já existe um veículo cadastrado com esta placa.',
    }
  }
}

function escapeCsv(value: unknown): string {
  const text = value == null ? '' : String(value)
  return `"${text.replace(/"/g, '""')}"`
}

function formatHistoryValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return 'Não informado'
  }
  if (typeof value === 'boolean') return value ? 'Ativo' : 'Inativo'
  return String(value)
}

function addHistory(
  vehicle: Pick<Vehicle, 'id' | 'plate'>,
  entry: Omit<VehicleHistoryEntry, 'id' | 'vehicleId' | 'plate' | 'createdAt'>
) {
  historyStore.unshift({
    ...entry,
    id: genId('hist'),
    vehicleId: vehicle.id,
    plate: vehicle.plate,
    createdAt: new Date(),
  })
}

function createUpdateChanges(
  current: Vehicle,
  updated: Vehicle
): VehicleHistoryChange[] {
  const fields: Array<{
    field: keyof Vehicle
    label: string
    read?: (vehicle: Vehicle) => unknown
  }> = [
    { field: 'plate', label: 'Placa' },
    { field: 'brand', label: 'Marca' },
    { field: 'model', label: 'Modelo' },
    { field: 'year', label: 'Ano' },
    { field: 'vehicleType', label: 'Tipo' },
    { field: 'isActive', label: 'Status' },
    {
      field: 'companyId',
      label: 'Empresa',
      read: (vehicle) => vehicle.company.tradeName,
    },
    { field: 'description', label: 'Descrição' },
  ]

  return fields.flatMap(({ field, label, read }) => {
    const previousValue = read ? read(current) : current[field]
    const nextValue = read ? read(updated) : updated[field]

    if (String(previousValue ?? '') === String(nextValue ?? '')) return []

    return [
      {
        field: String(field),
        label,
        from: formatHistoryValue(previousValue),
        to: formatHistoryValue(nextValue),
      },
    ]
  })
}

export const getVehicles = async (
  params: QueryVehicleDto,
  signal?: AbortSignal
) => {
  void signal
  const query = queryVehicleSchema.parse(params)
  await delay()

  const filtered = store.filter((vehicle) => {
    if (
      !matchesSearch(
        [
          vehicle.plate,
          vehicle.brand,
          vehicle.model,
          vehicle.description,
          vehicle.company.tradeName,
        ],
        query.search
      )
    ) {
      return false
    }

    if (query.companyId && vehicle.companyId !== query.companyId) return false
    if (
      query.plate &&
      !vehicle.plate.toLowerCase().includes(query.plate.toLowerCase())
    ) {
      return false
    }
    if (
      query.brand &&
      !vehicle.brand.toLowerCase().includes(query.brand.toLowerCase())
    ) {
      return false
    }
    if (query.vehicleType && vehicle.vehicleType !== query.vehicleType) {
      return false
    }
    if (query.isActive !== undefined && vehicle.isActive !== query.isActive) {
      return false
    }

    return true
  })

  return paginate(
    filtered as unknown as Record<string, unknown>[],
    query
  ) as unknown as {
    data: Vehicle[]
    meta: { total: number; page: number; limit: number; totalPages: number }
  }
}

export const getVehicleById = async (id: string) => {
  await delay(150)
  const vehicle = store.find((item) => item.id === id)

  if (!vehicle) {
    throw { statusCode: 404, message: 'Veículo não encontrado.' }
  }

  return cloneVehicle(vehicle)
}

export const getVehicleHistory = async (
  vehicleId: string,
  params: { page: number; limit: number }
) => {
  await delay(150)
  const page = Math.max(1, params.page)
  const limit = Math.max(1, params.limit)
  const entries = historyStore
    .filter((entry) => entry.vehicleId === vehicleId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  const total = entries.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit

  return {
    data: entries.slice(start, start + limit).map((entry) => ({
      ...entry,
      changes: entry.changes.map((change) => ({ ...change })),
      createdAt: new Date(entry.createdAt),
    })),
    meta: { total, page, limit, totalPages },
  }
}

export const createVehicle = async (data: CreateVehicleDto) => {
  const valid = createVehicleSchema.parse({
    ...data,
    plate: data.plate.trim(),
    brand: data.brand.trim(),
    model: data.model.trim(),
    description: data.description?.trim() || data.description,
  })
  await delay()

  const plate = normalizePlate(valid.plate)
  ensureUniquePlate(plate)

  const company = await resolveCompany(valid.companyId)
  const now = new Date()
  const vehicle: Vehicle = {
    id: genId('veh'),
    plate,
    brand: valid.brand.trim(),
    model: valid.model.trim(),
    year: valid.year,
    vehicleType: valid.vehicleType,
    isActive: valid.isActive,
    description: valid.description?.trim() || null,
    companyId: company.id,
    company,
    createdAt: now,
    updatedAt: now,
  }

  store.unshift(vehicle)
  addHistory(vehicle, {
    action: 'created',
    title: 'Veículo cadastrado',
    description: `${vehicle.brand} ${vehicle.model} foi adicionado à frota.`,
    changes: [],
  })
  return cloneVehicle(vehicle)
}

export const updateVehicle = async (id: string, data: UpdateVehicleDto) => {
  const valid = updateVehicleSchema.parse({
    ...data,
    ...(data.plate !== undefined && { plate: data.plate.trim() }),
    ...(data.brand !== undefined && { brand: data.brand.trim() }),
    ...(data.model !== undefined && { model: data.model.trim() }),
    ...(data.description !== undefined && {
      description: data.description?.trim() || data.description,
    }),
  })
  await delay()

  const index = store.findIndex((item) => item.id === id)
  if (index === -1) {
    throw { statusCode: 404, message: 'Veículo não encontrado.' }
  }

  const current = store[index]
  const nextPlate =
    valid.plate !== undefined ? normalizePlate(valid.plate) : current.plate

  ensureUniquePlate(nextPlate, id)

  const company =
    valid.companyId !== undefined
      ? await resolveCompany(valid.companyId)
      : current.company

  const updated: Vehicle = {
    ...current,
    ...(valid.plate !== undefined && { plate: nextPlate }),
    ...(valid.brand !== undefined && { brand: valid.brand.trim() }),
    ...(valid.model !== undefined && { model: valid.model.trim() }),
    ...(valid.year !== undefined && { year: valid.year }),
    ...(valid.vehicleType !== undefined && {
      vehicleType: valid.vehicleType,
    }),
    ...(valid.isActive !== undefined && { isActive: valid.isActive }),
    ...(valid.description !== undefined && {
      description: valid.description?.trim() || null,
    }),
    ...(valid.companyId !== undefined && {
      companyId: company.id,
      company,
    }),
    updatedAt: new Date(),
  }

  const changes = createUpdateChanges(current, updated)
  store[index] = updated

  if (changes.length > 0) {
    const statusOnly = changes.length === 1 && changes[0]?.field === 'isActive'
    addHistory(updated, {
      action: statusOnly ? 'status_changed' : 'updated',
      title: statusOnly ? 'Status alterado' : 'Cadastro atualizado',
      description: statusOnly
        ? `O veículo foi marcado como ${updated.isActive ? 'ativo' : 'inativo'}.`
        : `${changes.length} ${changes.length === 1 ? 'campo foi alterado' : 'campos foram alterados'}.`,
      changes,
    })
  }

  return cloneVehicle(updated)
}

export const bulkUpdateVehicleStatus = async (
  ids: string[],
  isActive: boolean
) => {
  await delay()
  const uniqueIds = [...new Set(ids)]
  let updatedCount = 0

  for (const id of uniqueIds) {
    const index = store.findIndex((vehicle) => vehicle.id === id)
    if (index === -1 || store[index].isActive === isActive) continue

    const previous = store[index]
    const updated = { ...previous, isActive, updatedAt: new Date() }
    store[index] = updated
    updatedCount += 1

    addHistory(updated, {
      action: 'status_changed',
      title: 'Status alterado em lote',
      description: `O veículo foi marcado como ${isActive ? 'ativo' : 'inativo'}.`,
      changes: [
        {
          field: 'isActive',
          label: 'Status',
          from: previous.isActive ? 'Ativo' : 'Inativo',
          to: isActive ? 'Ativo' : 'Inativo',
        },
      ],
    })
  }

  return { updated: updatedCount }
}

export const deleteVehicle = async (id: string) => {
  await delay()
  const index = store.findIndex((item) => item.id === id)

  if (index === -1) {
    throw { statusCode: 404, message: 'Veículo não encontrado.' }
  }

  const [removed] = store.splice(index, 1)
  addHistory(removed, {
    action: 'deleted',
    title: 'Veículo excluído',
    description: `${removed.brand} ${removed.model} foi removido da frota.`,
    changes: [],
  })
  return { id }
}

export const bulkDeleteVehicles = async (ids: string[]) => {
  await delay()
  const uniqueIds = new Set(ids)
  const removed = store.filter((vehicle) => uniqueIds.has(vehicle.id))

  for (const vehicle of removed) {
    addHistory(vehicle, {
      action: 'deleted',
      title: 'Veículo excluído em lote',
      description: `${vehicle.brand} ${vehicle.model} foi removido da frota.`,
      changes: [],
    })
  }

  for (let index = store.length - 1; index >= 0; index -= 1) {
    if (uniqueIds.has(store[index].id)) store.splice(index, 1)
  }

  return { deleted: removed.length }
}

export const getVehiclesList = async () => {
  await delay(150)
  return {
    data: store.map(({ id, plate, brand, model }) => ({
      id,
      plate,
      brand,
      model,
    })),
  }
}

function createVehicleCsv(vehicles: Vehicle[]) {
  const header = [
    'id',
    'plate',
    'brand',
    'model',
    'year',
    'vehicleType',
    'isActive',
    'company',
    'description',
  ].join(',')

  const rows = vehicles.map((vehicle) =>
    [
      vehicle.id,
      vehicle.plate,
      vehicle.brand,
      vehicle.model,
      vehicle.year,
      vehicle.vehicleType,
      vehicle.isActive,
      vehicle.company.tradeName,
      vehicle.description,
    ]
      .map(escapeCsv)
      .join(',')
  )

  return toArrayBuffer([header, ...rows].join('\n'))
}

export const exportVehicles = async () => {
  await delay()
  return createVehicleCsv(store)
}

export const exportSelectedVehicles = async (ids: string[]) => {
  await delay()
  const selectedIds = new Set(ids)
  return createVehicleCsv(
    store.filter((vehicle) => selectedIds.has(vehicle.id))
  )
}

/** Utilitário exclusivo dos testes automatizados do service mockado. */
export function resetVehicleStore() {
  store.splice(0, store.length, ...vehicleSeed.map(cloneVehicle))
  historyStore.splice(0, historyStore.length, ...buildInitialHistory(store))
}
