import { expect } from 'chai'
import { deleteSession } from '@app/operations/v1/sessions/delete'
import { createUserWithTokens } from '@data/users'
import { UserNotFoundError } from '@app/utils/errors'

describe('Operations | sessions', () => {
  describe('#delete', () => {
    it('returns updated refreshToken with attribute revokedAt set', async () => {
      const { user, refreshToken: token } = await createUserWithTokens()
      const refreshToken = await deleteSession.execute({ userId: user.id, token })

      expect(refreshToken).to.have.property('revokedAt')
      expect(refreshToken.revokedAt).to.not.be.null()
    })

    it('throws an error when user does not exist', async () => {
      const { refreshToken: token } = await createUserWithTokens()

      await expect(deleteSession.execute({ userId: 999, token })).to
        .be.rejectedWith(UserNotFoundError)
    })

    it('throws an error when refresh token is incorrect', async () => {
      const { user } = await createUserWithTokens()

      await expect(deleteSession.execute({ userId: user.id, token: 'obviouslyFake' })).to
        .be.rejectedWith(UserNotFoundError)
    })
  })
})
