'use client'

import { getCompaniesList } from '@/modules/companies/services/companyService'
import { useEntityList } from './useEntityList'

export const useCompanies = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  return useEntityList(['companies', 'list'], getCompaniesList, { enabled })
}
