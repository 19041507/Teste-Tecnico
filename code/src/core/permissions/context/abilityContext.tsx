'use client'

import { AppAbility } from '@/core/permissions/abilities'
import { createContextualCan } from '@casl/react'
import { createContext } from 'react'

export const AbilityContext = createContext<AppAbility>(undefined!)
export const Can = createContextualCan(AbilityContext.Consumer)
