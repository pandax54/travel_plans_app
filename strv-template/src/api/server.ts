import Application from '@app/api/app'

const startApplication = (): void => {
  const appInstance = new Application()
  appInstance.start().catch(Application.fatal) // eslint-disable-line @typescript-eslint/unbound-method
}

startApplication()
