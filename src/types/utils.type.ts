export interface SuccessResponse<Data> {
  message: string
  data: Data
  content: Data
  token: string
  userName: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: number
  role: string
  status: string
  totalElements: number
  totalPages: number
  size: number
  number: number
  id: number
}
export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

// cú pháp `-?` sẽ loại bỏ undefiend của key optional

export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
