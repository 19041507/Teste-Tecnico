import { z } from 'zod'

export const SigninSchema = z.object({
  username: z
    .string({ required_error: 'Usuário é obrigatório' })
    .min(1, 'Usuário é obrigatório')
    .max(30, 'Usuário muito longo'),

  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(1, 'Senha é obrigatória')
    .max(100, 'Senha muito longa'),
})

export type SigninFormData = z.infer<typeof SigninSchema>
