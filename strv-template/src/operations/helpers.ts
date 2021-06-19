import { UserNotFoundError } from '@app/utils/errors'
import { User } from '@models/user'
import { RefreshToken } from '@models/refresh-token'

export const needUser = (user?: User, err = new UserNotFoundError()): User => {
  if (!user) {
    throw err
  }

  return user
}

export const needRefreshToken = (refreshToken?: RefreshToken, err = new UserNotFoundError()): RefreshToken => {
  if (!refreshToken) {
    throw err
  }

  return refreshToken
}
