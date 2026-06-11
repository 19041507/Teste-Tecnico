import { z } from 'zod'

export const vehicleActionSchema = z.enum([
  'manage',
  'create',
  'read',
  'update',
  'delete',
])

export type VehicleAction = z.infer<typeof vehicleActionSchema>
