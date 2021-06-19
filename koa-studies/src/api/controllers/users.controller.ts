import { Context } from 'koa'
// import * as compose from 'koa-compose'
// import { authenticated } from '@app/api/middleware/policies/authenticated'
// import { createUser, Input as CreateUserInput } from '@operations/v1/users/create'
// import { updateUser, Input as UpdateUserInput } from '@operations/v1/users/update'
// import { getUser, Input as GetUserInput } from '@app/operations/v1/users/get'
// import { validate } from '@app/api/middleware/controller-validations'
// import * as schema from '@app/api/validations/schema/v1/users'
// import { userWithTokens } from '@app/api/serializers/user'


const create = async (ctx: Context): Promise<void> => {
    console.log(ctx.request.body)
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: ctx.request.body
    }
}

// export const create = compose([
//   validate({ body: schema.create }),
//   async (ctx: Context): Promise<void> => {
//     const inputData: CreateUserInput = {
//       email: ctx.request.body.email,
//       password: ctx.request.body.password,
//       ipAddress: ctx.request.ip,
//     }

//     const operationResult = await createUser.execute(inputData)
//     ctx.created(userWithTokens(operationResult.user, operationResult.accessToken, operationResult.refreshToken))
//   },
// ])

// export const update = compose([
//   authenticated,
//   validate({ body: schema.update }),
//   async (ctx: Context): Promise<void> => {
//     const inputData: UpdateUserInput = {
//       id: ctx.request.user.id,
//       updateData: {
//         password: ctx.request.body.password,
//       },
//     }
//     ctx.ok(await updateUser.execute(inputData))
//   },
// ])

// export const me = compose([
//   authenticated,
//   async (ctx: Context): Promise<void> => {
//     const inputData: GetUserInput = {
//       id: ctx.request.user.id,
//     }

//     ctx.ok(await getUser.execute(inputData))
//   },
// ])


export { create }
