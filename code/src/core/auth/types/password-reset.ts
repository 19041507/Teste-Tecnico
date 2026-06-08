import { z } from 'zod'

export const requestPasswordResetSchema = z.object({
  email: z
    .string({ required_error: 'O e-mail é obrigatório' })
    .email('E-mail inválido')
    .max(255, 'E-mail muito longo'),
})

export type RequestPasswordResetDto = z.infer<typeof requestPasswordResetSchema>

export const resetPasswordSchema = z
  .object({
    token: z
      .string({ required_error: 'O token é obrigatório' })
      .min(1, 'Token inválido'),
    newPassword: z
      .string({ required_error: 'A nova senha é obrigatória' })
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .max(128, 'A senha deve ter no máximo 128 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
      ),
    confirmPassword: z.string({
      required_error: 'A confirmação de senha é obrigatória',
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>
