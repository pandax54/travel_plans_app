declare module 'koa-respond' {
  import { Middleware } from 'koa'

  function makeRespondMiddleware(opts?: any): Middleware

  export = makeRespondMiddleware
}
