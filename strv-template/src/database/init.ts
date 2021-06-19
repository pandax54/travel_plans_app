import Knex, { Knex as KnexType } from 'knex'
import { Model } from 'objection'
import { config } from '@app/config'
import { KnexFileEnv } from '@app/config/knexfile'
import { logger } from '@app/utils/logger'

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const knexConfig: KnexFileEnv = require('../config/knexfile')

interface QueryData {
  sql: string
  bindings: string
}

export const initializeDb = async (): Promise<KnexType> => {
  if (!knexConfig.hasOwnProperty(config.env)) {
    throw new Error(`Your knexfile is missing section '${config.env}'`)
  }

  // Initialize knex.
  const knex = Knex(knexConfig[config.env]) // eslint-disable-line new-cap

  // Test connection
  try {
    await knex.raw('select 1+1 as result')
  } catch (err) {
    logger.fatal('DB connection failed')
    throw err
  }

  knex.on('query', (queryData: QueryData) => {
    logger.debug({ sql: queryData.sql, params: queryData.bindings }, 'DB')
  })

  // Bind all Models to a knex instance. If you only have one database in
  // your server this is all you have to do. For multi database systems, see
  // the Model.bindKnex method.
  Model.knex(knex)

  logger.info('DB connection initialized')

  return knex
}
