import { Config } from '@app/config'

const config: DeepPartial<Config> = {
  logging: {
    stdout: {
      enabled: true,
      level: 'debug',
      pretty: true,
    },
  },

  server: {
    concurrency: 3,
  },
}

export = config
