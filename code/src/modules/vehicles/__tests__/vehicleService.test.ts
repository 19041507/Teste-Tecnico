import assert from 'node:assert/strict'
import { beforeEach, describe, it } from 'node:test'
import { VehicleType } from '@/modules/vehicles/enums/vehicle-type.enum'
import {
  bulkDeleteVehicles,
  bulkUpdateVehicleStatus,
  createVehicle,
  getVehicleHistory,
  getVehicles,
  resetVehicleStore,
  updateVehicle,
} from '@/modules/vehicles/services/vehicleService'

const baseVehicle = {
  companyId: 'cmp-0025',
  plate: 'TST-1234',
  brand: 'Toyota',
  model: 'Yaris',
  year: 2024,
  vehicleType: VehicleType.CAR,
  isActive: true,
  description: 'Veículo criado durante o teste automatizado.',
}

describe('vehicleService', () => {
  beforeEach(() => {
    resetVehicleStore()
  })

  it('pagina e ordena a listagem de veículos', async () => {
    const result = await getVehicles({
      page: 2,
      limit: 5,
      orderBy: 'plate',
      order: 'asc',
    })

    assert.equal(result.meta.page, 2)
    assert.equal(result.meta.limit, 5)
    assert.equal(result.data.length, 5)
    assert.ok(result.meta.total > result.data.length)
    assert.ok(result.meta.totalPages > 1)

    const plates = result.data.map((vehicle) => vehicle.plate)
    assert.deepEqual(
      plates,
      [...plates].sort((a, b) => a.localeCompare(b))
    )
  })

  it('normaliza a placa e associa somente uma empresa já cadastrada', async () => {
    const vehicle = await createVehicle({
      ...baseVehicle,
      plate: ' tst-1234 ',
    })

    assert.equal(vehicle.plate, 'TST-1234')
    assert.equal(vehicle.companyId, 'cmp-0025')
    assert.equal(vehicle.company.tradeName, 'Cascata')
  })

  it('impede placas duplicadas ignorando caixa e espaços', async () => {
    await createVehicle(baseVehicle)

    await assert.rejects(
      () =>
        createVehicle({
          ...baseVehicle,
          plate: ' tst-1234 ',
          model: 'Corolla',
        }),
      (error: unknown) => {
        const apiError = error as { statusCode?: number; message?: string }
        return (
          apiError.statusCode === 409 &&
          apiError.message === 'Já existe um veículo cadastrado com esta placa.'
        )
      }
    )
  })

  it('exige uma empresa no cadastro do veículo', async () => {
    await assert.rejects(
      () =>
        createVehicle({
          ...baseVehicle,
          companyId: null,
        }),
      (error: unknown) => {
        const apiError = error as { statusCode?: number; message?: string }
        return (
          apiError.statusCode === 400 &&
          apiError.message === 'Empresa é obrigatória.'
        )
      }
    )
  })

  it('recusa empresa que não existe no cadastro de clientes', async () => {
    await assert.rejects(
      () =>
        createVehicle({
          ...baseVehicle,
          companyId: 'cmp-inexistente',
        }),
      (error: unknown) => {
        const apiError = error as { statusCode?: number; message?: string }
        return (
          apiError.statusCode === 400 &&
          apiError.message === 'A empresa selecionada não foi encontrada.'
        )
      }
    )
  })

  it('combina filtros de empresa, tipo e status mantendo paginação', async () => {
    const result = await getVehicles({
      page: 1,
      limit: 3,
      companyId: 'cmp-0025',
      vehicleType: VehicleType.CAR,
      isActive: true,
      orderBy: 'createdAt',
      order: 'desc',
    })

    assert.ok(result.data.length <= 3)
    assert.equal(result.meta.page, 1)
    assert.equal(result.meta.limit, 3)
    assert.ok(
      result.data.every(
        (vehicle) =>
          vehicle.companyId === 'cmp-0025' &&
          vehicle.vehicleType === VehicleType.CAR &&
          vehicle.isActive
      )
    )
  })

  it('registra e pagina o histórico de alterações', async () => {
    const created = await createVehicle(baseVehicle)

    await updateVehicle(created.id, {
      brand: 'Honda',
      model: 'City',
      isActive: false,
    })

    const firstPage = await getVehicleHistory(created.id, {
      page: 1,
      limit: 1,
    })
    const secondPage = await getVehicleHistory(created.id, {
      page: 2,
      limit: 1,
    })

    assert.equal(firstPage.meta.total, 2)
    assert.equal(firstPage.meta.totalPages, 2)
    assert.equal(firstPage.data.length, 1)
    assert.equal(firstPage.data[0]?.action, 'updated')
    assert.ok(firstPage.data[0]?.changes.length)
    assert.equal(secondPage.data[0]?.action, 'created')
  })

  it('atualiza status e exclui veículos em lote', async () => {
    const first = await createVehicle(baseVehicle)
    const second = await createVehicle({
      ...baseVehicle,
      plate: 'LOT-5678',
      model: 'Corolla',
    })

    const updated = await bulkUpdateVehicleStatus([first.id, second.id], false)
    assert.equal(updated.updated, 2)

    const filtered = await getVehicles({
      page: 1,
      limit: 10,
      search: 'TST-1234',
      orderBy: 'createdAt',
      order: 'desc',
    })
    assert.equal(filtered.data[0]?.isActive, false)

    const deleted = await bulkDeleteVehicles([first.id, second.id])
    assert.equal(deleted.deleted, 2)

    const remaining = await getVehicles({
      page: 1,
      limit: 10,
      search: 'LOT-5678',
      orderBy: 'createdAt',
      order: 'desc',
    })
    assert.equal(remaining.meta.total, 0)
  })
})
