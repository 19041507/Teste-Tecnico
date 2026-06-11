import { z } from 'zod'
import { createVehicleSchema } from './create-vehicle.dto'

export const updateVehicleSchema = createVehicleSchema.partial()

export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>
