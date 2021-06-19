import * as R from 'ramda'
import { UserRole } from '@app/utils/enums'
import { userRepository } from '@repositories/user'
import { User } from '@models/user'
import { createTokens } from '@data/refresh-tokens'
import { userWithTokens, UserWithTokens } from '@app/api/serializers/user'
import { generateNewAccessToken } from '@services/internal/access-tokens'

interface MockedData {
  [index: string]: string
}

interface MockedDataCollection {
  [index: string]: MockedData
}

export const batman = {
  email: 'bruce.wayne@wayneindustries.com',
  password: 'iamBatman',
}

export const superman = {
  email: 'clark.kent@dailyplanet.com',
  password: 'iFearKryptonite',
}

export const users: MockedDataCollection = {
  batman,
  superman,
}

export interface UserParams {
  fakeName: string
  role?: UserRole
}

export const createUser = async (params: UserParams = { fakeName: 'batman' }): Promise<User> => {
  const defaultParams = {
    role: UserRole.user,
  }
  params = R.merge(defaultParams, params)
  const user = await userRepository.insert({
    ...users[params.fakeName],
    role: params.role,
  }).returning('*')

  return user
}

export const createUserWithTokens = async (params?: UserParams): Promise<UserWithTokens> => {
  const user = await createUser(params)
  const refreshToken = await createTokens(user.id)
  const accessToken = generateNewAccessToken(user.id)
  return userWithTokens(user, accessToken, refreshToken)
}
