import { promisify } from 'util'
import { Context } from 'koa'
import * as jwt from 'jsonwebtoken'
import { config } from '@app/config'
import { UnauthorizedError } from '@app/utils/errors'
import { userRepository } from '@repositories/user'

const BEARER_PREFIX = 'Bearer '

interface IAuthorizationTokenPayload {
  userId: number
}

const verifyAsync = promisify<string, jwt.Secret, jwt.VerifyOptions, object>(jwt.verify)

// eslint-disable-next-line @typescript-eslint/return-await
const verifyAccessToken = async (accessToken: string): Promise<{}> =>
  await verifyAsync(accessToken, config.auth.pepper, { algorithms: ['HS256'] })

export const authorization = async (ctx: Context, middleware: () => Promise<void>): Promise<void> => {
  const authHeader = ctx.headers.authorization

  ctx.request.user = null

  if (!authHeader) {
    await middleware()
    return
  }

  let payload
  try {
    payload = await verifyAccessToken(authHeader.replace(BEARER_PREFIX, '')) as IAuthorizationTokenPayload
  } catch (err) {
    throw new UnauthorizedError()
  }

  ctx.request.user = await userRepository.findById(payload.userId) // eslint-disable-line require-atomic-updates

  await middleware()
}
