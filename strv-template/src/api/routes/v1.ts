import { Context } from 'koa'
import * as Router from 'koa-router'
import * as controllers from '@controllers/v1'

const router = new Router<{}, Context>({ prefix: '/v1' })

// --- users ----------------
router.post('/users', controllers.users.create)
router.get('/users/me', controllers.users.me)
router.patch('/users/me', controllers.users.update)

// --- sessions -------------
router.post('/sessions/native', controllers.sessions.create)
router.post('/sessions/refresh', controllers.sessions.refresh)
router.post('/sessions/destroy', controllers.sessions.destroy)

export const v1Routes = router.routes()
