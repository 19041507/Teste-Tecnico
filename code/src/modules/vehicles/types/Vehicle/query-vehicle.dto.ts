import { z } from 'zod'
import { VehicleType } from '../../enums/vehicle-type.enum'

export const queryVehicleSchema = z.object({
  search: z.string().optional(),
  companyId: z.string().optional(),
  plate: z.string().optional(),
  brand: z.string().optional(),
  vehicleType: z.nativeEnum(VehicleType).optional(),
  isActive: z
    .preprocess(
      (val) => (val === 'true' ? true : val === 'false' ? false : val),
      z.boolean().optional()
    )
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  orderBy: z
    .enum([
      'plate',
      'brand',
      'model',
      'year',
      'vehicleType',
      'isActive',
      'companyId',
      'createdAt',
      'updatedAt',
    ])
    .default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export type QueryVehicleDto = z.infer<typeof queryVehicleSchema>
