import { Transaction } from 'objection'
import { UserRepository } from '@repositories/user'
import { RefreshTokenRepository } from '@repositories/refresh-token'

export class TransactionalRepositories {
  private readonly trx: Transaction

  private userRepository?: UserRepository
  private refreshTokenRepository?: RefreshTokenRepository

  constructor(trx: Transaction) {
    this.trx = trx
  }

  get user(): UserRepository {
    if (!this.userRepository) {
      this.userRepository = new UserRepository(this.trx)
    }
    return this.userRepository
  }

  get refreshToken(): RefreshTokenRepository {
    if (!this.refreshTokenRepository) {
      this.refreshTokenRepository = new RefreshTokenRepository(this.trx)
    }
    return this.refreshTokenRepository
  }
}
