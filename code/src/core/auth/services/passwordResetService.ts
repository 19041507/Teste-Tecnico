import axios from '@/core/http/axios'
import {
  RequestPasswordResetDto,
  ResetPasswordDto,
  resetPasswordSchema,
} from '@/core/auth/types/password-reset'

const BASE = '/users'

export const requestPasswordReset = async (data: RequestPasswordResetDto) => {
  const response = await axios.post(`${BASE}/forgot-password`, data)
  return response.data
}

export const validatePasswordResetToken = async (token: string) => {
  const response = await axios.get(
    `${BASE}/validate-password-reset-token/${token}`
  )
  return response.data
}

export const resetPassword = async (data: ResetPasswordDto) => {
  const validatedData = resetPasswordSchema.parse(structuredClone(data))
  const response = await axios.post(`${BASE}/reset-password`, validatedData)
  return response.data
}
