import { z } from 'zod'
import { createCompanyFieldsSchema } from './create-company-fields.dto'

export const createCompanySchema = z.object({
  companyFields: createCompanyFieldsSchema,
})

export type CreateCompanyDto = z.infer<typeof createCompanySchema>
