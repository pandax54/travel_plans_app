import { expect } from 'chai'
import { authorization } from '@app/api/middleware/authorization'
import { authenticatedAdmin } from '@app/api/middleware/policies/admin'
import { UserRole } from '@app/utils/enums'
import { ForbiddenError } from '@app/utils/errors'
import { createUserWithTokens } from '@data/users'

const middlewareMock = async (): Promise<void> => {}

describe('Policies: Admin', () => {
  let ctx: any // eslint-disable-line @typescript-eslint/no-explicit-any

  beforeEach(() => {
    ctx = { request: {}, response: {}, headers: {} }
  })

  it('does not throw an error when user is an admin', async () => {
    const { accessToken } = await createUserWithTokens({ fakeName: 'batman', role: UserRole.admin })

    ctx.headers = { authorization: accessToken }

    await authorization(ctx, middlewareMock)
    await expect(authenticatedAdmin(ctx, middlewareMock)).to.be.fulfilled
  })

  it('does throw an error when user is not an admin', async () => {
    const { accessToken } = await createUserWithTokens()

    ctx.headers = { authorization: accessToken }

    await authorization(ctx, middlewareMock)
    await expect(authenticatedAdmin(ctx, middlewareMock)).to.be.rejectedWith(ForbiddenError)
  })
})
