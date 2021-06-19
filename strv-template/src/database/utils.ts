import { Model, transaction as tr } from 'objection'
import { TransactionalRepositories } from '@repositories/transactional-repositories'

type TransactionCallback = (repositories: TransactionalRepositories) => Promise<void>

export const transaction = async (callback: TransactionCallback): Promise<void> => {
  const trx = await tr.start(Model.knex())
  let result: any // eslint-disable-line @typescript-eslint/no-explicit-any

  try {
    const repos = new TransactionalRepositories(trx)
    result = await callback(repos) // eslint-disable-line callback-return
    await trx.commit()
  } catch (err) {
    await trx.rollback()
    throw err
  }

  return result
}
