import * as Router from 'koa-router'
import { Context } from 'koa'

const router = new Router<{}, Context>()

router.get('/healthz', (ctx: Context) => {
  ctx.noContent()
})

export const healthCheck = router.routes()
