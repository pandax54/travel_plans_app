// Update with your config settings.
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
require('dotenv').config({ path: `${__dirname}/../../../.env` })

/* eslint-disable import/first */
import { Knex } from 'knex'
// import { knexSnakeCaseMappers } from 'objection'
// import { config } from '@app/config'
/* eslint-enable import/first */

export interface KnexFileEnv {
  [index: string]: Knex.Config
  local: Knex.Config
  development: Knex.Config
  test: Knex.Config
  staging: Knex.Config
  production: Knex.Config
}

const defaultOptions: Knex.Config = {
  debug: false,
  client: 'postgresql',
  connection: {
    database: "",
    user: "",
    password: ""
  },
  // connection: config.database.url,
  // ...knexSnakeCaseMappers(),
  seeds: {
    directory: '../database/seeds',
  },
  migrations: {
    directory: '../database/migrations',
  },
}

const knexConfig: KnexFileEnv = {
  local: {
    ...defaultOptions,
  },

  development: {
    ...defaultOptions,
  },

  test: {
    ...defaultOptions,
  },

  staging: {
    ...defaultOptions,
  },

  production: {
    ...defaultOptions,
    pool: {
      min: 2,
      max: 10,
    },
  },
}

module.exports = knexConfig
