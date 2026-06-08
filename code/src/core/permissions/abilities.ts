import { User } from '@/modules/users'
import { MongoAbility } from '@casl/ability'
import { UserAction } from './subjects/User'
import { Company } from '@/modules/companies'
import { CompanyAction } from './subjects/Company'
import { Vehicle } from '@/modules/vehicles'
import { VehicleAction } from './subjects/Vehicle'
export const APP_ABILITY_SUBJECT_NAMES = ['User', 'Company', 'Vehicle'] as const

export type AppAbilitySubjectName = (typeof APP_ABILITY_SUBJECT_NAMES)[number]

export type AppAbility = MongoAbility<
  | ['manage', 'all']
  | [UserAction, 'User' | User]
  | [CompanyAction, 'Company' | Company]
  | [VehicleAction, 'Vehicle' | Vehicle]
>
