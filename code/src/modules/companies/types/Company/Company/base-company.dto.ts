import { z } from 'zod'

export const companySchema = z.object({
  id: z.string(),
  registrationNumber: z.string(),
  legalName: z.string(),
  tradeName: z.string(),
  phone: z.string(),
  isActive: z.boolean(),
  address: z.string(),
  legalResponsibleName: z.string().nullable(),
  legalResponsibleEmail: z.string().nullable(),
  legalResponsiblePhone: z.string().nullable(),
  technicalResponsibleName: z.string().nullable(),
  technicalResponsibleEmail: z.string().nullable(),
  technicalResponsiblePhone: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Company = z.infer<typeof companySchema>
