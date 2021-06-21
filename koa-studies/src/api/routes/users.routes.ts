import { Context } from 'koa';
import Router from 'koa-router';
import { create } from '../controllers/users.controller'

const usersRouter = new Router({
  prefix: "/v1/api"
})

usersRouter.get('/success', async (ctx: Context) => {
  ctx.body = {
    status: 'success',
    message: 'hello, world!'
  };
})

// userRouter.post(`/create`, async (ctx) => {
//   try {
//     console.log(ctx.request.body)
//     const movie = ctx.request.body;
//     if (movie) {
//       ctx.status = 201;
//       ctx.body = {
//         status: 'success',
//         data: movie
//       };
//     } else {
//       ctx.status = 400;
//       ctx.body = {
//         status: 'error',
//         message: 'Something went wrong.'
//       };
//     }
//   } catch (err) {
//     console.log(err)
//   }
// })

usersRouter.post("/user", create )


export const usersRoutes: Router.IMiddleware = usersRouter.routes();
