// import Koa, { Context } from "koa";
// import cors from "kcors";
// // import logger from "koa-logger";
// import json from 'koa-json';
// import userRouter from './routes/users.routes'
// import bodyParser from 'koa-bodyparser';
// import { initializeDb } from '@app/api/database/init'
// import { logger }  from '@app/utils/logger'

// const app = new Koa();


// app.use(
//   cors()
// );

// // app.use(logger());

// app.use(bodyParser());
// app.use(userRouter.routes());

// app.use(async (ctx: Context) => {
//   ctx.body = {
//     status: 'success',
//     message: 'server running!'
//   };
// });

// app.use(json())

// app
//   .listen(3000, () => {
//     console.log("server running");
//   })
//   .on("error", (err) => {
//     console.error(err);
//   });
import Application from '@app/api/app'

const startApplication = (): void => {
  const appInstance = new Application()
  appInstance.start().catch(Application.fatal) // eslint-disable-line @typescript-eslint/unbound-method
}

startApplication()
