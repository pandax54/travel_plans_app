/* eslint-disable @typescript-eslint/return-await */
import {
  Page,
  QueryBuilder,
  QueryBuilderType,
  SingleQueryBuilder,
  Transaction,
} from 'objection'
import { User } from '@models/user'
import { BaseRepository, OrderOptions, PaginationOptions } from '@repositories/base'

export interface UserOrderOptions extends OrderOptions {
  column: 'id' | 'createdAt' | 'email' | string
}

export interface FilterOptions {
  order: UserOrderOptions
  pagination: PaginationOptions
}

export interface PaginatedUserList {
  total: number
  results: User[]
}

export class UserRepository extends BaseRepository<User> {
  constructor(transaction?: Transaction) {
    super(User, transaction)
  }

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  findByEmail(email: string): SingleQueryBuilder<QueryBuilderType<User>> {
    return this.findAll().where({ email }).first()
  }

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  findForAdmin(options: FilterOptions): QueryBuilder<User, Page<User>> {
    const { order, pagination } = options

    return this.findAll()
      .skipUndefined()
      .orderBy(order.column, order.direction)
      .page(pagination.page, pagination.pageSize)
  }
}

export const userRepository = new UserRepository()
