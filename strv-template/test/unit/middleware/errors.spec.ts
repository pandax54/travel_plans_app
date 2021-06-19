/* eslint-disable @typescript-eslint/promise-function-async */

import { expect } from 'chai'
import { handleErrors } from '@app/api/middleware/error-handling'
import { config } from '@app/config'
import { ApiError, RecordNotFoundError } from '@app/utils/errors'

const unknownErrorMiddlewareMock = (): Promise<void> => {
  throw new Error()
}

const apiErrorMiddlewareMock = (): Promise<void> => {
  throw new ApiError('TYPE', 'Message')
}

const notFoundErrorMiddlewareMock = (): Promise<void> => {
  throw new RecordNotFoundError('Not found')
}

describe('Error handling', () => {
  let ctx: any // eslint-disable-line @typescript-eslint/no-explicit-any

  beforeEach(() => {
    ctx = { request: {}, response: {} }
  })

  describe('Unknown error', () => {
    it('responds with message and stacktrace on non-production env', async () => {
      await handleErrors(ctx, unknownErrorMiddlewareMock)

      expect(ctx.body).to.have.property('message')
      expect(ctx.body).to.have.property('stacktrace')
    })

    it('responds with message and correlationId on production env', async () => {
      const envValToRestore = config.env
      config.env = 'production'
      await handleErrors(ctx, unknownErrorMiddlewareMock)
      config.env = envValToRestore // eslint-disable-line require-atomic-updates

      expect(ctx.body).to.have.property('message')
      expect(ctx.body).to.have.property('correlationId')
    })
  })

  describe('Known error', () => {
    it('responds with type, message and errors details', async () => {
      await handleErrors(ctx, apiErrorMiddlewareMock)

      expect(ctx.body).to.have.property('message')
      expect(ctx.body).to.have.property('type')
      expect(ctx.body).to.have.property('errors')
    })

    it('responds with statusCode 500 if no other statusCode is set', async () => {
      await handleErrors(ctx, apiErrorMiddlewareMock)

      expect(ctx.status).to.be.equal(500)
    })

    it('responds with statusCode assigned to custom error', async () => {
      await handleErrors(ctx, notFoundErrorMiddlewareMock)

      expect(ctx.status).to.be.equal(404)
    })
  })
})
