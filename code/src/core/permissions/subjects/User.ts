import { z } from 'zod'

export const userActionSchema = z.enum([
  'manage',
  'create',
  'read',
  'update',
  'delete',
])

export type UserAction = z.infer<typeof userActionSchema>
