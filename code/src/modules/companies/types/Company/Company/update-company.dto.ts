import { z } from 'zod'
import { updateCompanyFieldsSchema } from './update-company-fields.dto'

export const updateCompanySchema = z.object({
  companyFields: updateCompanyFieldsSchema.optional(),
})

export type UpdateCompanyDto = z.infer<typeof updateCompanySchema>
