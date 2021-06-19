import { expect } from 'chai'
import { authorization } from '@app/api/middleware/authorization'
import { UnauthorizedError } from '@app/utils/errors'
import { createUserWithTokens } from '@data/users'

const middlewareMock = async (): Promise<void> => {}

describe('Authorization', () => {
  let ctx: any // eslint-disable-line @typescript-eslint/no-explicit-any

  beforeEach(() => {
    ctx = { request: {}, response: {}, headers: {} }
  })

  it('sets user object to null if no authorization is provided in headers', async () => {
    await authorization(ctx, middlewareMock)

    expect(ctx.request.user).to.be.null()
  })

  it('throws an error when authorization header is not valid JWT token', async () => {
    ctx.headers = { authorization: 'Foo' }

    await expect(authorization(ctx, middlewareMock)).to.be.rejectedWith(UnauthorizedError)
  })

  it('sets correct user object based on id from JWT token', async () => {
    const { user, accessToken } = await createUserWithTokens()
    ctx.headers = { authorization: accessToken }

    await authorization(ctx, middlewareMock)

    expect(ctx.request.user.id).to.be.equal(user.id)
  })
})
