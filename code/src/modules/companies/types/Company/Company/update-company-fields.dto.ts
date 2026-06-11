import z from 'zod'
import { createCompanyFieldsSchema } from './create-company-fields.dto'

export const updateCompanyFieldsSchema = createCompanyFieldsSchema.partial()

export type UpdateCompanyFieldsDto = z.infer<typeof updateCompanyFieldsSchema>
