import { Context } from 'koa'
import * as Router from 'koa-router'
import * as controllers from '@controllers/admin'

const router = new Router<{}, Context>({ prefix: '/admin' })

// --- users ----------------
router.get('/users', controllers.users.list)
router.get('/users/:id', controllers.users.show)
router.patch('/users/:id', controllers.users.update)
router.delete('/users/:id', controllers.users.destroy)

export const adminRoutes = router.routes()
