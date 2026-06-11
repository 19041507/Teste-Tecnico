import { z } from 'zod'

export const createCompanyFieldsSchema = z.object({
  registrationNumber: z
    .string({ required_error: 'CNPJ é obrigatório' })
    .length(18, { message: 'O CNPJ deve ter 18 dígitos' })
    .regex(
      /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
      'CNPJ deve estar formatado corretamente (00.000.000/0000-00)'
    ),
  legalName: z
    .string({ required_error: 'Razão social é obrigatória' })
    .min(3, { message: 'Razão social deve ter pelo menos 3 caracteres' })
    .max(200, { message: 'Razão social deve ter no máximo 200 caracteres' }),
  tradeName: z
    .string({ required_error: 'Nome fantasia é obrigatório' })
    .min(3, { message: 'Nome fantasia deve ter pelo menos 3 caracteres' })
    .max(150, { message: 'Nome fantasia deve ter no máximo 150 caracteres' }),
  phone: z.string({ required_error: 'Telefone é obrigatório' }),
  address: z
    .string({ required_error: 'Endereço é obrigatório' })
    .min(3, { message: 'Endereço deve ter pelo menos 3 caracteres' }),
  isActive: z.boolean(),
  legalResponsibleName: z
    .string()
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' })
    .nullable()
    .optional(),
  legalResponsibleEmail: z
    .string()
    .email({ message: 'E-mail inválido' })
    .max(255, { message: 'E-mail deve ter no máximo 255 caracteres' })
    .nullable()
    .optional(),
  legalResponsiblePhone: z
    .string({ required_error: 'Telefone é obrigatório' })
    .nullable()
    .optional(),
  technicalResponsibleName: z
    .string()
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' })
    .nullable()
    .optional(),
  technicalResponsibleEmail: z
    .string()
    .email({ message: 'E-mail inválido' })
    .max(255, { message: 'E-mail deve ter no máximo 255 caracteres' })
    .nullable()
    .optional(),
  technicalResponsiblePhone: z
    .string({ required_error: 'Telefone é obrigatório' })
    .nullable()
    .optional(),
})

export type CreateCompanyFieldsDto = z.infer<typeof createCompanyFieldsSchema>
