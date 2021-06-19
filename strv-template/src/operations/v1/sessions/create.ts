import { lowerCaseObjectProperty } from '@app/utils/helpers'
import { userRepository } from '@repositories/user'
import { comparePasswords } from '@app/utils/crypto'
import { InvalidCredentialsError } from '@app/utils/errors'
import { Operation } from '@operations/operation'
import { needUser } from '@operations/helpers'
import { newRefreshToken } from '@services/internal/refresh-tokens'
import { refreshTokenRepository } from '@repositories/refresh-token'
import { AccessToken, generateNewAccessToken } from '@services/internal/access-tokens'
import { User } from '@models/user'
import { RefreshToken } from '@models/refresh-token'

export type Input = Pick<User, 'email' | 'password' > & Pick<RefreshToken, 'ipAddress'>

export interface Output {
  user: User
  accessToken: AccessToken
  refreshToken: RefreshToken
}

class CreateSession extends Operation<Input, Output> {
  protected async run(requestData: Input): Promise<Output> {
    const singInData = lowerCaseObjectProperty(requestData, 'email') as Input

    const user = needUser(await userRepository.findByEmail(singInData.email))

    if (!await comparePasswords(singInData.password, user.password)) {
      throw new InvalidCredentialsError('Login failed')
    }

    const refreshToken = await refreshTokenRepository.insert(newRefreshToken(user.id, requestData.ipAddress))
    const accessToken = generateNewAccessToken(user.id)

    return {
      user,
      refreshToken,
      accessToken,
    }
  }
}

export const createSession = new CreateSession()
