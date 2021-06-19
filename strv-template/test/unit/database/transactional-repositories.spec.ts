import * as fs from 'fs'
import { promisify } from 'util'
import { Model, transaction } from 'objection'
import * as camelCase from 'camelcase'
import { expect } from 'chai'
import { TransactionalRepositories } from '@app/database/repositories/transactional-repositories'

describe('TransactionalRepositories', () => {
  it('Every repository should be in transactional repositories', async () => {
    const readDir = promisify(fs.readdir)
    const files = await readDir(`${__dirname}/../../../src/database/repositories/`)
    const repoFiles = files
      .filter((filename: string) => !filename.startsWith('base') && !filename.startsWith('transactional-repositories'))
      .map((filename: string) => camelCase(filename.substr(0, filename.length - 3)))

    const trx = await transaction.start(Model.knex())
    const repositories = new TransactionalRepositories(trx)
    await trx.commit()

    repoFiles.forEach((repo: string) => {
      expect(repositories).to.have.property(repo)
    })
  })
})
