import { z } from 'zod'

export const jwtPayloadUserSchema = z.object({
  sub: z.string(),
  username: z.string().optional().default(''),
  name: z.string().optional().default(''),
  isActive: z.boolean().optional().default(false),
  roles: z.array(z.string()).optional().default([]),
  companyId: z.string().nullable().optional().default(null),
  iat: z.number().optional(),
  exp: z.number().optional(),
})

export type JwtPayloadUser = z.infer<typeof jwtPayloadUserSchema>
