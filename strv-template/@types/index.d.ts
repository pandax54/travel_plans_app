import * as _ from 'koa'

declare module 'koa' {
  import { User } from '@models/user'

  export interface Request {
    user: User | null
  }

  interface Context extends BaseContext {
    query: {
      [key: string]: string | string[]
      orderDirection?: 'asc' | 'desc'
    }

    valid: { body?: any, query?: any, params?: any }
    ok(payload: any): any
    created(payload: any): any
    noContent(payload?: any): any
    badRequest(payload: any): any
    unauthorized(payload: any): any
    forbidden(payload: any): any
    notFound(payload: any): any
    internalServerError(payload: any): any
  }
}

// to support custom expect matcher
declare global {
  namespace Chai {
    interface Assertion {
      matchSnapshot(): void;
    }
  }

  export type DeepPartial<T> = {
    [K in keyof T]?: DeepPartial<T[K]>
  }
}
