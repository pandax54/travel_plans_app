import { Config } from '@app/config'

const config: DeepPartial<Config> = {
  auth: {
    saltRounds: 1,
  },

  logging: {
    stdout: {
      enabled: false,
    },
  },

  database: {
    url: process.env.DATABASE_URL_TEST ?? 'postgres://postgres:postgres@localhost:5432/layered-tpl-test',
  },
}

export = config
