export type UserRole = 'admin_master' | 'user'

export interface AuthUser {
  email: string
  emailVerifiedAt: string | null
  id: string
  name: string
  role: UserRole
  status: string
}
