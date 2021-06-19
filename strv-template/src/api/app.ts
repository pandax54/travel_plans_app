import { Server } from 'http'
import * as koaBody from 'koa-body'
import { Model } from 'objection'
import * as kcors from 'kcors'
import * as Koa from 'koa'
import * as koaHelmet from 'koa-helmet'
import { authorization } from '@app/api/middleware/authorization'
import { handleErrors } from '@app/api/middleware/error-handling'
import { healthCheck } from '@app/api/routes/health-check'
import { adminRoutes } from '@app/api/routes/admin'
import { docsRoutes } from '@app/api/routes/docs'
import { v1Routes } from '@app/api/routes/v1'
import { config } from '@app/config'
import { initializeDb } from '@app/database/init'
import { logger } from '@app/utils/logger'
// eslint-disable-next-line @typescript-eslint/no-require-imports
import koaRespond = require('koa-respond')

export default class Application {
  app: Koa

  private server: Server | null

  constructor() {
    this.app = new Koa()
    this.server = null
    this.setup()
  }

  static fatal(err: Error): void {
    // Remove termination listener
    process.removeAllListeners('uncaughtException')
    process.exitCode = 1
    logger.fatal({ err }, 'Fatal error occurred. Exiting the app.')
  }

  async start(): Promise<void> {
    // Handle unexpected termination
    process.once('uncaughtException', Application.fatal) // eslint-disable-line @typescript-eslint/unbound-method
    process.once('unhandledRejection', (reason, promise) => {
      process.removeAllListeners('unhandledRejection')
      logger.fatal('Unhandled Rejection at:', promise, 'reason:', reason)
    })

    // Handle expected termination
    /* eslint-disable @typescript-eslint/no-misused-promises */
    process.once('SIGINT', async () => await this.stop())
    process.once('SIGTERM', async () => await this.stop())
    /* eslint-enable @typescript-eslint/no-misused-promises */

    await initializeDb()

    return await new Promise(resolve => {
      this.server = this.app.listen(config.server.port, () => {
        const port = config.server.port
        logger.info(`==> 🌎  Server listening on port ${port.toString()}`)
      })

      return resolve()
    })
  }

  async stop(): Promise<void> {
    if (!this.server) {
      logger.warn('Server not initialized yet.')
      return
    }

    // Remove termination listener
    process.removeAllListeners('SIGINT')
    process.removeAllListeners('SIGTERM')

    logger.info('Closing database connection ...')
    try {
      await Model.knex().destroy()
    } catch {
      process.exitCode = 1 // eslint-disable-line
      logger.info('Failed to close database connection.')
    }

    logger.info('Stopping server ...')
    this.server.close(() => {
      logger.info('Server stopped.')
    })
  }

  private setup(): void {
    this.app.use(handleErrors)

    this.app.use(koaHelmet())
    this.app.use(koaRespond())
    this.app.use(koaBody())
    this.app.use(kcors({ origin: '*' }))

    this.app.use(authorization)

    this.app.use(healthCheck)
    this.app.use(adminRoutes)
    this.app.use(v1Routes)

    if (config.env !== 'production') {
      this.app.use(docsRoutes)
    }

    // Something can happen outside the error handling middleware, keep track of that
    this.app.on('error', err => logger.error({ err }, 'Unhandled application error.'))
  }
}
