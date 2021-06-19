/* eslint-disable @typescript-eslint/return-await */
import {
  QueryBuilderType,
  SingleQueryBuilder,
  Transaction,
} from 'objection'
import { RefreshToken } from '@models/refresh-token'
import { BaseRepository } from '@repositories/base'

export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  constructor(transaction?: Transaction) {
    super(RefreshToken, transaction)
  }

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  findByToken(token: string): SingleQueryBuilder<QueryBuilderType<RefreshToken>> {
    return this.findAll().where({ token }).first()
  }

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  findByUserIdAndToken(userId: number, token: string): SingleQueryBuilder<QueryBuilderType<RefreshToken>> {
    return this.findAll().where({ userId, token }).first()
  }
}

export const refreshTokenRepository = new RefreshTokenRepository()
