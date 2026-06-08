'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAbility } from '@/core/permissions/context/AbilityProvider'
import { useCompanies } from '@/shared/hooks/useCompanies'
import { toOptions } from '@/shared/utils/mappers'
import { Company } from '@/modules/companies/types/Company/Company/base-company.dto'

interface CompanyFormOption {
  value: string
  label: string
}

interface UseCompanyFormOptionsReturn {
  isAdmin: boolean
  selectedCompanyId: string | null
  setSelectedCompanyId: (id: string | null) => void
  COMPANY_OPTIONS: CompanyFormOption[]
}

export function useCompanyFormOptions(
  initialCompanyId?: string | null
): UseCompanyFormOptionsReturn {
  const ability = useAbility()
  const isAdmin = ability.can('manage', 'Company')
  const { data: companies } = useCompanies({ enabled: isAdmin })

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    initialCompanyId ?? null
  )

  useEffect(() => {
    setSelectedCompanyId(initialCompanyId ?? null)
  }, [initialCompanyId])

  const COMPANY_OPTIONS = useMemo(
    () =>
      toOptions(companies?.data, (c: Company) => ({
        value: c.id,
        label: c.tradeName,
      })),
    [companies?.data]
  )

  return {
    isAdmin,
    selectedCompanyId,
    setSelectedCompanyId,
    COMPANY_OPTIONS,
  }
}
