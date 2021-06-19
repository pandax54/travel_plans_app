import * as throng from 'throng'
import Application from '@app/api/app'
import { config } from '@app/config'
import { logger } from '@app/utils/logger'

const startApplication = (): void => {
  const appInstance = new Application()
  appInstance.start().catch(Application.fatal) // eslint-disable-line @typescript-eslint/unbound-method
}

const startWorkerProcess = (id: number): void => {
  logger.info(`Started worker ${id.toString()}.`)
  startApplication()
}

const startMasterProcess = (): void => {
  logger.info('Master process started.')
}

throng({
  workers: config.server.concurrency,
  grace: 3000,
  master: startMasterProcess,
  start: startWorkerProcess,
})
