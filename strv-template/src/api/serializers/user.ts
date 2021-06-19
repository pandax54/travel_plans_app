import * as moment from 'moment'
import { User } from '@models/user'
import { RefreshToken } from '@models/refresh-token'
import { AccessToken } from '@services/internal/access-tokens'

export interface UserWithTokens {
  accessToken: string
  accessTokenExpiresAt: Date | moment.Moment
  refreshToken: string
  refreshTokenExpiresAt: Date
  user: User
}

export const userWithTokens = (user: User, accessToken: AccessToken, refreshToken: RefreshToken): UserWithTokens => ({
  accessToken: accessToken.token,
  accessTokenExpiresAt: accessToken.expiresAt,
  user,
  refreshToken: refreshToken.token,
  refreshTokenExpiresAt: refreshToken.expiresAt,
})
