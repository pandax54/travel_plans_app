import { expect } from 'chai'
import { authorization } from '@app/api/middleware/authorization'
import { authenticated } from '@app/api/middleware/policies/authenticated'
import { generateNewAccessToken } from '@services/internal/access-tokens'
import { UnauthorizedError } from '@app/utils/errors'
import { batman } from '@data/users'
import { userRepository } from '@repositories/user'

const middlewareMock = async (): Promise<void> => {}

describe('Policies: Authenticated', () => {
  let ctx: any // eslint-disable-line @typescript-eslint/no-explicit-any

  beforeEach(() => {
    ctx = { request: {}, response: {}, headers: {} }
  })

  it('throws an error when user is not authenticated', async () => {
    await authorization(ctx, middlewareMock)

    await expect(authenticated(ctx, middlewareMock)).to.be.rejectedWith(UnauthorizedError)
  })

  it('does not throw an error when user is successfully authenticated', async () => {
    const user = await userRepository.insert(batman)

    ctx.headers = { authorization: `Bearer ${generateNewAccessToken(user.id).token}` }

    await authorization(ctx, middlewareMock)
    await expect(authenticated(ctx, middlewareMock)).to.be.fulfilled
  })
})
