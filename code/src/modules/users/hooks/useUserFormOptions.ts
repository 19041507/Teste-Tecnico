'use client'

import { useMemo } from 'react'
import { Role } from '@/shared/enums/role.enum'
import { enumToOptions } from '@/shared/utils/mappers'
import { isCompanyRole, isSystemAdminRole } from '@/shared/utils/roleUtils'

export interface UserFormOption {
  value: string
  label: string
}

interface UseUserFormOptionsOptions {
  isAdmin: boolean
  selectedCompanyId: string | null
}

export interface UseUserFormOptionsReturn {
  ROLE_OPTIONS: UserFormOption[]
  isCompanyContextReady: boolean
}

export function useUserFormOptions({
  isAdmin,
  selectedCompanyId,
}: UseUserFormOptionsOptions): UseUserFormOptionsReturn {
  const ROLE_OPTIONS = useMemo(() => {
    const options = enumToOptions(Role)
    const hasCompany = Boolean(selectedCompanyId)
    const isCompanyContext = hasCompany || !isAdmin

    return options.filter((opt) => {
      const role = opt.value as Role

      if (isCompanyContext) {
        if (role === Role.MANAGER) {
          return isAdmin && hasCompany
        }

        if (!isCompanyRole(role)) {
          return false
        }

        return true
      }

      return isSystemAdminRole(role)
    })
  }, [isAdmin, selectedCompanyId])

  const isCompanyContextReady = useMemo(() => {
    if (isAdmin) return selectedCompanyId !== null
    return true
  }, [isAdmin, selectedCompanyId])

  return {
    ROLE_OPTIONS,
    isCompanyContextReady,
  }
}
