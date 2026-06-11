import { z } from 'zod'
import { VehicleType } from '../../enums/vehicle-type.enum'

export const vehicleSchema = z.object({
  id: z.string(),
  plate: z.string(),
  brand: z.string(),
  model: z.string(),
  year: z.number().int().positive(),
  vehicleType: z.nativeEnum(VehicleType),
  isActive: z.boolean(),
  description: z.string().nullable(),
  companyId: z.string(),
  company: z.object({
    id: z.string(),
    tradeName: z.string(),
  }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Vehicle = z.infer<typeof vehicleSchema>
