import { Context } from 'koa'
import * as compose from 'koa-compose'
import { authenticated } from '@app/api/middleware/policies/authenticated'
import { deleteSession, Input as DeleteSessionInput } from '@operations/v1/sessions/delete'
import { createSession, Input as CreateSessionInput } from '@operations/v1/sessions/create'
import { refreshSession, Input as RefreshSessionInput } from '@operations/v1/sessions/refresh'
import { userWithTokens } from '@app/api/serializers/user'
import { serializeAccessToken } from '@app/api/serializers/access-token'
import { validate } from '@app/api/middleware/controller-validations'
import * as schema from '@app/api/validations/schema/v1/sessions'

export const create = compose([
  validate({ body: schema.create }),
  async (ctx: Context): Promise<void> => {
    const inputData: CreateSessionInput = {
      email: ctx.request.body.email,
      password: ctx.request.body.password,
      ipAddress: ctx.request.ip,
    }

    const operationResult = await createSession.execute(inputData)
    ctx.created(userWithTokens(operationResult.user, operationResult.accessToken, operationResult.refreshToken))
  },
])

export const refresh = compose([
  validate({ body: schema.refreshToken }),
  async (ctx: Context): Promise<void> => {
    const inputData: RefreshSessionInput = {
      token: ctx.request.body.refreshToken,
    }

    const operationResult = await refreshSession.execute(inputData)
    ctx.created(serializeAccessToken(operationResult))
  },
])

export const destroy = compose([
  authenticated,
  validate({ body: schema.refreshToken }),
  async (ctx: Context): Promise<void> => {
    const inputData: DeleteSessionInput = {
      userId: ctx.request.user.id,
      token: ctx.request.body.refreshToken,
    }

    ctx.noContent(await deleteSession.execute(inputData))
  },
])
