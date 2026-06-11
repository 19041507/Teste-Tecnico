import { z } from 'zod'
import { Role } from '@/shared/enums/role.enum'

export const createUserSchema = z.object({
  username: z
    .string({ required_error: 'Usuário é obrigatório' })
    .min(3, { message: 'Usuário deve ter pelo menos 3 caracteres' })
    .max(30, { message: 'Usuário deve ter no máximo 30 caracteres' })
    .regex(/^[a-zA-Z0-9_.]+$/, {
      message:
        'Usuário deve conter apenas letras, números, sublinhados e pontos',
    }),
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
  email: z
    .string({ required_error: 'E-mail é obrigatório' })
    .email({ message: 'E-mail inválido' })
    .max(255, { message: 'E-mail deve ter no máximo 255 caracteres' }),
  isActive: z.boolean(),
  roles: z.array(z.nativeEnum(Role)).min(1, {
    message: 'Deve haver pelo menos um cargo atribuído ao usuário',
  }),
  companyId: z
    .string({ required_error: 'Empresa é obrigatória' })
    .refine((val) => val !== '', {
      message: 'Empresa é obrigatória',
    })
    .nullable()
    .optional(),
  password: z
    .string({ required_error: 'A senha é obrigatória' })
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .max(128, 'A senha deve ter no máximo 128 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
    ),
})

export type CreateUserDto = z.infer<typeof createUserSchema>
