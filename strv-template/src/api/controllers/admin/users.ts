import * as compose from 'koa-compose'
import { Context } from 'koa'
import { authenticatedAdmin } from '@app/api/middleware/policies/admin'
import { getUser } from '@app/operations/admin/users/get'
import { updateUser } from '@app/operations/admin/users/update'
import { listUsers } from '@app/operations/admin/users/list'
import { deleteUser } from '@app/operations/admin/users/delete'
import { validate } from '@app/api/middleware/controller-validations'
import * as schema from '@app/api/validations/schema/admin/users'

export const list = compose([
  authenticatedAdmin,
  validate({ query: schema.listQueryParams }),
  async (ctx: Context): Promise<void> => {
    const options = {
      order: {
        column: ctx.query.orderColumn as string || 'createdAt',
        direction: ctx.query.orderDirection ?? 'desc',
      },
      pagination: {
        page: Number(ctx.query.page) || 0,
        pageSize: Number(ctx.query.pageSize) || 15,
      },
    }
    ctx.ok(await listUsers.execute(options))
  },
])

export const show = compose([
  authenticatedAdmin,
  validate({ params: schema.idParam }),
  async (ctx: Context): Promise<void> => {
    ctx.ok(await getUser.execute({ userId: parseInt(ctx.params.id) }))
  },
])

export const update = compose([
  authenticatedAdmin,
  validate({ params: schema.idParam, body: schema.update }),
  async (ctx: Context): Promise<void> => {
    const parsedRequest = {
      userId: parseInt(ctx.params.id),
      updateData: {
        email: ctx.request.body.email,
        role: ctx.request.body.role,
      },
    }
    ctx.ok(await updateUser.execute(parsedRequest))
  },
])

export const destroy = compose([
  authenticatedAdmin,
  validate({ params: schema.idParam }),
  async (ctx: Context): Promise<void> => {
    ctx.noContent(await deleteUser.execute({ userId: parseInt(ctx.params.id) }))
  },
])
