type Role = 'Customer' | 'Admin'

export interface User {
  role?: Role[]
  email?: string
  userName?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string | number
  password?: string
  avatarUrl?: string
  id?: number
  user_id?: number
  name?: string
  phone?: string
  address?: string
  avatar?: string
  date_of_birth?: string
}
