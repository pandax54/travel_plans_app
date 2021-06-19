/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, transaction } from 'objection'
import { TransactionalRepositories } from '@repositories/transactional-repositories'

type TransactionBody = (repositories: TransactionalRepositories) => Promise<any>

export const startDbTransaction = async (transactionBody: TransactionBody): Promise<any> => {
  let retVal: any
  const trx = await transaction.start(Model.knex())
  try {
    const transactionRepositories = new TransactionalRepositories(trx)
    retVal = await transactionBody(transactionRepositories)
    await trx.commit()
  } catch (err) {
    await trx.rollback()
    throw err
  }

  return retVal
}
