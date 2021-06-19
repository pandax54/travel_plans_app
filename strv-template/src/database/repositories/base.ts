/* eslint-disable @typescript-eslint/return-await */
import {
  ArrayQueryBuilder,
  ModelClass,
  QueryBuilderType,
  SingleQueryBuilder,
  Transaction,
} from 'objection'
import { BaseModel } from '@models/base'

export interface PaginationOptions {
  page: number
  pageSize: number
}

export interface OrderOptions {
  column: string
  direction: 'asc' | 'desc'
}

export class BaseRepository<T extends BaseModel> {
  model: ModelClass<T>
  protected transaction?: Transaction

  constructor(model: ModelClass<T>, transaction?: Transaction) {
    this.model = model
    this.transaction = transaction
  }

  query(): ArrayQueryBuilder<QueryBuilderType<T>> {
    return (this.model as any).query(this.transaction) // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  insert(data: object): SingleQueryBuilder<QueryBuilderType<T>> {
    return this.query().insertAndFetch(data)
  }

  findAll(): ArrayQueryBuilder<QueryBuilderType<T>> {
    return this.query().where({ deletedAt: null })
  }

  findById(id: number): SingleQueryBuilder<QueryBuilderType<T>> {
    return this.query().where({ deletedAt: null }).findById(id)
  }

  patchById(id: number, data: object): SingleQueryBuilder<QueryBuilderType<T>> {
    return this.query().updateAndFetchById(id, data)
  }

  deleteById(id: number): SingleQueryBuilder<QueryBuilderType<T>> {
    return this.patchById(id, { deletedAt: new Date() })
  }
}
