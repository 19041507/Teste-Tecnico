import { z } from 'zod'

export const queryCompanySchema = z.object({
  search: z.string().optional(),
  registrationNumber: z.string().optional(),
  legalName: z.string().optional(),
  tradeName: z.string().optional(),
  isActive: z
    .string()
    .transform((val) => val.toLowerCase() === 'true')
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  orderBy: z
    .enum([
      'registrationNumber',
      'legalName',
      'tradeName',
      'isActive',
      'createdAt',
      'updatedAt',
    ])
    .default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export type QueryCompanyDto = z.infer<typeof queryCompanySchema>
