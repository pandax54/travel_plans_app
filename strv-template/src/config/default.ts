import { Config, getEnvironmentValue } from '@app/config'

const config: Config = {
  appName: 'layered-tpl',
  auth: {
    commonTokenLength: 20,
    accessTokenExpiration: 60 * 60,
    pepper: getEnvironmentValue('PEPPER', '496ba1dd1953e309d528370d96dd6e6f0bbbf693759a54f96e07235a6f201b9a94fdf8'),
    saltRounds: 10,
    refreshTokenExpiration: 60 * 60 * 24 * 30,
  },

  database: {
    url: getEnvironmentValue('DATABASE_URL', 'postgres://postgres:postgres@localhost:5432/layered-tpl-development'),
  },
  env: getEnvironmentValue('NODE_ENV', 'local'),
  logging: {
    stdout: {
      enabled: true,
      level: 'debug',
      pretty: false,
    },
    sensitiveParameters: ['password'],
  },

  server: {
    concurrency: Number(getEnvironmentValue('WEB_CONCURRENCY', '1')),
    port: Number(getEnvironmentValue('PORT', '3000')),
  },
}

export = config
