import { RefreshToken } from '@models/refresh-token'
import { Operation } from '@operations/operation'
import { refreshTokenRepository } from '@repositories/refresh-token'
import { needRefreshToken } from '@operations/helpers'

export type Input = Pick<RefreshToken, 'userId' | 'token'>

class DeleteSession extends Operation<Input, RefreshToken> {
  protected async run(requestData: Input): Promise<RefreshToken> {
    const { userId, token } = requestData
    const refreshToken = needRefreshToken(await refreshTokenRepository.findByUserIdAndToken(userId, token))

    return await refreshTokenRepository.patchById(refreshToken.id, {
      revokedAt: new Date(),
    })
  }
}

export const deleteSession = new DeleteSession()
