import { Context } from 'koa'
import * as compose from 'koa-compose'
import { UserRole } from '@app/utils/enums'
import { ForbiddenError } from '@app/utils/errors'
import { authenticated } from '@app/api/middleware/policies/authenticated'

const admin = async (ctx: Context, middleware: () => Promise<void>): Promise<void> => {
  if (ctx.request.user.role !== UserRole.admin) {
    throw new ForbiddenError()
  }

  await middleware()
}

export const authenticatedAdmin = compose([authenticated, admin])
