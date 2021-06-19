import * as moment from 'moment'
import { RefreshTokenExpiredError } from '@app/utils/errors'
import { Operation } from '@operations/operation'
import { refreshTokenRepository } from '@repositories/refresh-token'
import { needRefreshToken } from '@operations/helpers'
import { AccessToken, generateNewAccessToken } from '@services/internal/access-tokens'
import { RefreshToken } from '@models/refresh-token'

export type Input = Pick<RefreshToken, 'token'>

class RefreshSession extends Operation<Input, AccessToken> {
  protected async run(requestData: Input): Promise<AccessToken> {
    const refreshToken = needRefreshToken(await refreshTokenRepository.findByToken(requestData.token))

    if (moment().isAfter(refreshToken.expiresAt)
      || (refreshToken.revokedAt && moment().isAfter(refreshToken.revokedAt))) {
      throw new RefreshTokenExpiredError()
    }
    return generateNewAccessToken(refreshToken.userId)
  }
}

export const refreshSession = new RefreshSession()
