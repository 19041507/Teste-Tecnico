import { z } from 'zod'

export const companyActionSchema = z.enum([
  'manage',
  'create',
  'read',
  'update',
  'delete',
])

export type CompanyAction = z.infer<typeof companyActionSchema>
