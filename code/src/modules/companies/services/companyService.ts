/**
 * Service de Company — versão MOCKADA (sem backend).
 *
 * Mantém exatamente a mesma API pública da versão que falava com o backend via
 * axios, mas opera sobre um datastore em memória (`mock-companies.ts`). Em
 * produção, estas funções voltariam a usar `@/core/http/axios`.
 */
import {
  QueryCompanyDto,
  queryCompanySchema,
} from '@/modules/companies/types/Company/Company/query-company.dto'
import { CreateCompanyDto } from '@/modules/companies/types/Company/Company/create-company.dto'
import { UpdateCompanyDto } from '@/modules/companies/types/Company/Company/update-company.dto'
import { Company } from '@/modules/companies/types/Company/Company/base-company.dto'
import { mockCompanies } from '@/modules/companies/data/mock-companies'
import {
  delay,
  genId,
  matchesSearch,
  paginate,
  toArrayBuffer,
} from '@/shared/mocks/mock-store'

// Datastore mutável em memória (reinicia a cada reload da aplicação).
const store: Company[] = [...mockCompanies]

export const getCompanies = async (
  params: QueryCompanyDto,
  signal?: AbortSignal
) => {
  void signal
  const q = queryCompanySchema.parse(params)
  await delay()

  const filtered = store.filter((c) => {
    if (!matchesSearch([c.legalName, c.tradeName, c.registrationNumber], q.search))
      return false
    if (q.registrationNumber && !c.registrationNumber.includes(q.registrationNumber))
      return false
    if (q.legalName && !c.legalName.toLowerCase().includes(q.legalName.toLowerCase()))
      return false
    if (q.tradeName && !c.tradeName.toLowerCase().includes(q.tradeName.toLowerCase()))
      return false
    if (q.isActive !== undefined && c.isActive !== q.isActive) return false
    return true
  })

  return paginate(filtered as unknown as Record<string, unknown>[], q) as unknown as {
    data: Company[]
    meta: { total: number; page: number; limit: number; totalPages: number }
  }
}

export const createCompany = async (data: CreateCompanyDto) => {
  await delay()
  const f = data.companyFields
  const now = new Date()
  const company: Company = {
    id: genId('cmp'),
    registrationNumber: f.registrationNumber,
    legalName: f.legalName,
    tradeName: f.tradeName,
    phone: f.phone,
    isActive: f.isActive,
    address: f.address,
    legalResponsibleName: f.legalResponsibleName ?? null,
    legalResponsibleEmail: f.legalResponsibleEmail ?? null,
    legalResponsiblePhone: f.legalResponsiblePhone ?? null,
    technicalResponsibleName: f.technicalResponsibleName ?? null,
    technicalResponsibleEmail: f.technicalResponsibleEmail ?? null,
    technicalResponsiblePhone: f.technicalResponsiblePhone ?? null,
    createdAt: now,
    updatedAt: now,
  }
  store.unshift(company)
  return company
}

export const updateCompany = async (id: string, data: UpdateCompanyDto) => {
  await delay()
  const index = store.findIndex((c) => c.id === id)
  if (index === -1) throw { statusCode: 404, message: 'Empresa não encontrada.' }

  const f = data.companyFields ?? {}
  const updated: Company = {
    ...store[index],
    ...Object.fromEntries(
      Object.entries(f).filter(([, v]) => v !== undefined)
    ),
    id: store[index].id,
    updatedAt: new Date(),
  }
  store[index] = updated
  return updated
}

export const deleteCompany = async (id: string) => {
  await delay()
  const index = store.findIndex((c) => c.id === id)
  if (index !== -1) store.splice(index, 1)
  return { id }
}

export const getCompaniesList = async () => {
  await delay(150)
  // O endpoint real devolve uma lista enxuta; aqui devolvemos os registros
  // completos (o consumidor usa apenas `id` e `tradeName`).
  return { data: store }
}

export const exportCompanies = async () => {
  await delay()
  const header = 'id,registrationNumber,legalName,tradeName,isActive\n'
  const rows = store
    .map(
      (c) =>
        `${c.id},${c.registrationNumber},${c.legalName},${c.tradeName},${c.isActive}`
    )
    .join('\n')
  return toArrayBuffer(header + rows)
}
