import { ConflictError } from '@app/utils/errors'
import { lowerCaseObjectProperty } from '@app/utils/helpers'
import { Operation } from '@operations/operation'
import { newRefreshToken } from '@services/internal/refresh-tokens'
import { startDbTransaction } from '@app/database/db-transaction'
import { User } from '@models/user'
import { AccessToken, generateNewAccessToken } from '@services/internal/access-tokens'
import { RefreshToken } from '@models/refresh-token'

export type Input = Pick<User, 'email' | 'password'> & Pick<RefreshToken, 'ipAddress'>

export interface Output {
  user: User
  accessToken: AccessToken
  refreshToken: RefreshToken
}

class CreateUser extends Operation<Input, Output> {
  protected async run(requestData: Input): Promise<Output> {
    const userData = lowerCaseObjectProperty({ email: requestData.email, password: requestData.password }, 'email')
    const { user, refreshToken } = await startDbTransaction(async trx => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (await trx.user.findByEmail(userData.email)) {
        throw new ConflictError('User already exist in database')
      }
      const newUser = await trx.user.insert(userData)
      const tokenData = newRefreshToken(newUser.id, requestData.ipAddress)
      const createdRefreshToken = await trx.refreshToken.insert(tokenData)
      return { user: newUser, refreshToken: createdRefreshToken }
    })

    const accessToken = generateNewAccessToken(user.id)
    return {
      user,
      refreshToken,
      accessToken,
    }
  }
}

export const createUser = new CreateUser()
