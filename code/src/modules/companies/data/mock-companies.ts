/**
 * Empresas mockadas — fonte de dados do módulo `companies` (sem backend).
 *
 * Válidas contra `companySchema`
 * (src/modules/companies/types/Company/Company/base-company.dto.ts).
 *
 * Os três primeiros ids (`cmp-0001..0003`) são referenciados pelos mocks do
 * módulo de Veículos — mantenha-os ao editar.
 */
import type { Company } from '../types/Company/Company/base-company.dto'

const NAMES: { legalName: string; tradeName: string }[] = [
  { legalName: 'Águas do Vale Saneamento LTDA', tradeName: 'Águas do Vale' },
  { legalName: 'Hidrosul Saneamento S.A.', tradeName: 'Hidrosul Saneamento' },
  { legalName: 'Saneadora Litoral LTDA', tradeName: 'Saneadora Litoral' },
  { legalName: 'Companhia de Águas Serra Azul', tradeName: 'Serra Azul Águas' },
  { legalName: 'EcoÁgua Tratamento LTDA', tradeName: 'EcoÁgua' },
  { legalName: 'Aquaflux Engenharia LTDA', tradeName: 'Aquaflux' },
  { legalName: 'Fonte Clara Saneamento S.A.', tradeName: 'Fonte Clara' },
  { legalName: 'HidroTech Soluções LTDA', tradeName: 'HidroTech' },
  { legalName: 'Rio Verde Abastecimento LTDA', tradeName: 'Rio Verde' },
  { legalName: 'Nascente Pura Saneamento S.A.', tradeName: 'Nascente Pura' },
  { legalName: 'Bacia Hidrográfica Serviços LTDA', tradeName: 'Bacia Serviços' },
  { legalName: 'Vertente Azul LTDA', tradeName: 'Vertente Azul' },
  { legalName: 'Manancial Engenharia S.A.', tradeName: 'Manancial' },
  { legalName: 'AquaPrime Saneamento LTDA', tradeName: 'AquaPrime' },
  { legalName: 'Lençol Freático Serviços LTDA', tradeName: 'Lençol Serviços' },
  { legalName: 'Cristalina Águas S.A.', tradeName: 'Cristalina' },
  { legalName: 'Vale das Águas LTDA', tradeName: 'Vale das Águas' },
  { legalName: 'PuraVida Saneamento LTDA', tradeName: 'PuraVida' },
  { legalName: 'Hidromar Engenharia S.A.', tradeName: 'Hidromar' },
  { legalName: 'Correnteza Serviços LTDA', tradeName: 'Correnteza' },
  { legalName: 'AzulMar Abastecimento LTDA', tradeName: 'AzulMar' },
  { legalName: 'Fluxo Claro Saneamento S.A.', tradeName: 'Fluxo Claro' },
  { legalName: 'Reservatório Central LTDA', tradeName: 'Reservatório Central' },
  { legalName: 'Onda Azul Serviços LTDA', tradeName: 'Onda Azul' },
  { legalName: 'Cascata Engenharia S.A.', tradeName: 'Cascata' },
]

function pad(n: number, width = 4): string {
  return String(n).padStart(width, '0')
}

/** Gera um CNPJ formatado (apenas para exibição, não validado por dígito). */
function fakeCnpj(seed: number): string {
  const base = pad(seed, 8) + '0001' + pad((seed * 7) % 100, 2)
  return base.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  )
}

export const mockCompanies: Company[] = NAMES.map((n, i) => {
  const seq = i + 1
  const id = `cmp-${pad(seq)}`
  const createdAt = new Date(2025, 0, 1 + i, 9, 0, 0)
  return {
    id,
    registrationNumber: fakeCnpj(10000000 + seq),
    legalName: n.legalName,
    tradeName: n.tradeName,
    phone: `(11) 9${pad((seq * 1234) % 10000, 4)}-${pad((seq * 4321) % 10000, 4)}`,
    isActive: seq % 5 !== 0,
    address: `Rua das Nascentes, ${seq * 10} - São Paulo/SP`,
    legalResponsibleName: `Responsável Legal ${seq}`,
    legalResponsibleEmail: `legal${seq}@${n.tradeName
      .toLowerCase()
      .replace(/[^a-z]/g, '')}.com.br`,
    legalResponsiblePhone: `(11) 9${pad((seq * 999) % 10000, 4)}-0000`,
    technicalResponsibleName: `Responsável Técnico ${seq}`,
    technicalResponsibleEmail: `tecnico${seq}@${n.tradeName
      .toLowerCase()
      .replace(/[^a-z]/g, '')}.com.br`,
    technicalResponsiblePhone: `(11) 9${pad((seq * 777) % 10000, 4)}-1111`,
    createdAt,
    updatedAt: createdAt,
  }
})
