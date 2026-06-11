import { jwtDecode } from 'jwt-decode'
import {
  jwtPayloadUserSchema,
  type JwtPayloadUser,
} from '@/core/auth/types/jwt-payload'

export type { JwtPayloadUser } from '@/core/auth/types/jwt-payload'

export function getDecodedPayload(token: string): JwtPayloadUser | null {
  try {
    const decoded = jwtDecode<unknown>(token)
    const result = jwtPayloadUserSchema.safeParse(decoded)
    return result.success ? result.data : null
  } catch {
    return null
  }
}

export function isPayloadExpired(payload: JwtPayloadUser): boolean {
  if (payload.exp == null) return true
  return payload.exp * 1000 < Date.now()
}
