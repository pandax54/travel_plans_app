/* eslint-disable import/exports-last */

import * as R from 'ramda'

const env = process.env.NODE_ENV ?? 'local'

export interface Config {
  appName: string
  env: string

  auth: {
    pepper: string
    saltRounds: number
    accessTokenExpiration: number
    commonTokenLength: number
    refreshTokenExpiration: number
  }

  logging: {
    stdout: {
      enabled: boolean
      level: string
      pretty: boolean
    }
    sensitiveParameters: string[]
  }

  server: {
    concurrency: string | number
    port: number
  }

  database: {
    url: string
  }
}

export const getEnvironmentValue = (key: string, defaultValue?: string): string => {
  const envVal = process.env[key] ?? defaultValue

  if (!envVal) {
    throw new Error(`env variable ${key} has to be defined`)
  }

  return envVal
}

if (env === 'local' || env === 'test') {
  // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  require('dotenv').config({ silent: false })
}

/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const envConfig = require(`./environments/${env}`)
const defaultConfig = require('./default')

/* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
export const config = (R.mergeDeepRight(defaultConfig, envConfig) as object) as Config
