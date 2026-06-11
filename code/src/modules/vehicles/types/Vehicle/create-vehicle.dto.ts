import { z } from 'zod'
import { VehicleType } from '../../enums/vehicle-type.enum'

export const createVehicleSchema = z.object({
  companyId: z
    .string({ required_error: 'Empresa é obrigatória' })
    .refine((val) => val !== '', {
      message: 'Empresa é obrigatória',
    })
    .nullable()
    .optional(),
  plate: z
    .string({ required_error: 'Placa é obrigatória' })
    .min(1, 'Placa é obrigatória')
    .max(10, 'Placa deve ter no máximo 10 caracteres'),
  brand: z
    .string({ required_error: 'Marca é obrigatória' })
    .min(1, 'Marca é obrigatória')
    .max(50, 'Marca deve ter no máximo 50 caracteres'),
  model: z
    .string({ required_error: 'Modelo é obrigatório' })
    .min(1, 'Modelo é obrigatório')
    .max(50, 'Modelo deve ter no máximo 50 caracteres'),
  year: z
    .number({ required_error: 'Ano é obrigatório' })
    .int()
    .min(1900, 'Ano inválido')
    .max(new Date().getFullYear() + 1, 'Ano inválido'),
  vehicleType: z.nativeEnum(VehicleType, {
    required_error: 'Tipo de veículo é obrigatório',
  }),
  isActive: z.boolean(),
  description: z.string().max(500).nullable().optional(),
})

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>
