declare module 'koa-static2' {
  import { Middleware } from 'koa'

  function serve(path: string, root: string): Middleware
  export = serve
}
