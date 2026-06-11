export type Session = {
  id: string
  username: string
  name: string
  isActive: boolean
  roles: string[]
  companyId: string | null
  issuedAt: number
  expiresAt: number
}
