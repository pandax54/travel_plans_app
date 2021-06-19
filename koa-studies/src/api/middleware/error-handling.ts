import { Context } from 'koa'
import * as uuid from 'uuid'
import { config } from '@app/config'
import { ApiError } from '@app/utils/errors'
import { logger } from '@app/utils/logger'

interface IKnownError {
  type: string
  message: string
  errors?: {
    [propName: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

interface ParsedRequest {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  body: any
  headers: any
  /* eslint-enable @typescript-eslint/no-explicit-any */
  method: string
  url: string

}

const request = (ctx: Context): ParsedRequest => ({
  body: ctx.body,
  headers: ctx.request.headers,
  method: ctx.request.method,
  url: ctx.request.url,
})

const processKnownError = (ctx: Context, err: ApiError): void => {
  logger.warn({
    err,
    req: request(ctx),
    res: ctx.response,
  }, 'Handled error')

  const body: IKnownError = {
    message: err.message,
    type: err.type,
  }

  if (config.env !== 'production') {
    body.errors = err.errors
  }

  ctx.status = err.statusCode
  ctx.body = body
}

const processUnknownError = (ctx: Context, err: Error): void => {
  const correlationId = uuid.v1()
  logger.error({
    correlationId,
    err,
    req: request(ctx),
    res: ctx.response,
  }, 'Unhandled error')

  ctx.status = 500

  if (config.env === 'production') {
    ctx.body = {
      correlationId,
      message: 'Unknown error occurred.',
    }
  } else {
    ctx.body = {
      message: err.message,
      stacktrace: err.stack,
    }
  }
}

export const handleErrors = async (ctx: Context, middleware: () => Promise<void>): Promise<void> => {
  try {
    await middleware()
  } catch (err) {
    if (err instanceof ApiError) {
      processKnownError(ctx, err)
    } else {
      processUnknownError(ctx, err)
    }
  }
}
