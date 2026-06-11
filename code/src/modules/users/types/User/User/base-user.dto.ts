import { Role } from '@/shared/enums/role.enum'
import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string(),
  email: z.string(),
  isActive: z.boolean(),
  roles: z.array(z.nativeEnum(Role)),
  company: z
    .object({
      id: z.string(),
      tradeName: z.string(),
    })
    .nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof userSchema>
