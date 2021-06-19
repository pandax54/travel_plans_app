/* eslint-disable @typescript-eslint/no-explicit-any*/
import { Knex } from 'knex'
import { initializeDb } from '@app/database/init'

let knex: Knex

const query = "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public';"

const ignoreTableNames = [
  'knex_migrations',
  'knex_migrations_lock',
]

const initialize = async (): Promise<void> => {
  knex = await initializeDb()
}


const reset = async (): Promise<any> => {
  const result = await knex.raw(query)

  const tableNames = result
    .rows
    .map((table: any) => table[Object.keys(table)[0]]) // eslint-disable-line @typescript-eslint/no-explicit-any
    .filter((tableName: string) => !ignoreTableNames.includes(tableName))
    .map((tableName: string) => `"${tableName}"`)
  const tableNamesString: string = tableNames.join()

  return await knex.raw(`TRUNCATE ${tableNamesString} RESTART IDENTITY CASCADE`)
}

const closeConnection = async (): Promise<void> => await knex.destroy()

before(initialize)
after(closeConnection)
beforeEach(reset)
