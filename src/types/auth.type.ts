import { SuccessResponse } from './utils.type'
import { User } from './user.type'

export type AuthResponse = SuccessResponse<{
  access_token: string
  exprires: string
  user: User
}>

// const auth: AuthResponse = {
//     message: '',
//     data: {}
// }
