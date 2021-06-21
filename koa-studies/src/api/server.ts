import Koa, { Context } from "koa";
import cors from "kcors";
// import logger from "koa-logger";
import json from 'koa-json';
import { usersRoutes } from './routes/users.routes'
import bodyParser from 'koa-bodyparser';
import '../database/db';

const app = new Koa();

app.use(
  cors()
);

app.use(bodyParser());
app.use(usersRoutes);

app.use(async (ctx: Context) => {
  ctx.body = {
    status: 'success',
    message: 'server running!'
  };
});

app.use(json())

app
  .listen(3000, () => {
    console.log("server running");
  })
  .on("error", (err) => {
    console.error(err);
  });
