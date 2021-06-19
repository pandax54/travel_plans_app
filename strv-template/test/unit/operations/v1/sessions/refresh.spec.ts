import { expect } from 'chai'
import { refreshSession } from '@app/operations/v1/sessions/refresh'
import { createUserWithTokens } from '@data/users'
import { refreshTokenRepository } from '@app/database/repositories/refresh-token'
import { RefreshTokenExpiredError, UserNotFoundError } from '@app/utils/errors'

describe('Operations | sessions', () => {
  describe('#refresh', () => {
    it('returns a new valid accessToken', async () => {
      const { refreshToken } = await createUserWithTokens()
      const accessToken = await refreshSession.execute({ token: refreshToken })

      expect(accessToken).to.have.property('token')
      expect(accessToken.token).to.not.be.null()
      expect(accessToken).to.have.property('expiresAt')
      expect(accessToken.expiresAt).to.not.be.null()
    })

    it('throws an error when refresh token is incorrect', () =>
      expect(refreshSession.execute({ token: 'obviouslyFake' })).to.be.rejectedWith(UserNotFoundError))

    it('throws an error when refresh token was revoked', async () => {
      const { refreshToken: token } = await createUserWithTokens()
      const refreshToken = await refreshTokenRepository.findByToken(token)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await refreshTokenRepository.patchById(refreshToken.id, { revokedAt: new Date() })

      await expect(refreshSession.execute({ token })).to
        .be.rejectedWith(RefreshTokenExpiredError)
    })
  })
})
