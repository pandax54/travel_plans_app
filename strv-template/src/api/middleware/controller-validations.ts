/* eslint-disable @typescript-eslint/no-explicit-any */
import * as jsonschema from 'jsonschema'
import * as Koa from 'koa'
import * as qs from 'qs'
import { validator } from '@app/utils/validator'
import {
  InvalidRequestBodyError,
  InvalidRequestParamsError,
  InvalidRequestQueryStringError,
} from '@app/utils/errors'

enum ValidationTypes {
  body,
  queryString,
  params
}

interface ValidationSchema {
  body?: jsonschema.Schema
  query?: jsonschema.Schema
  params?: jsonschema.Schema
}

const controllerValidator = (object: any, schema: jsonschema.Schema, type = ValidationTypes.body): void => {
  const err = validator.validate(object, schema).errors
  if (err.length <= 0) {
    return
  }
  switch (type) {
    case ValidationTypes.params:
      throw new InvalidRequestParamsError('Invalid request params', err)
    case ValidationTypes.queryString:
      throw new InvalidRequestQueryStringError('Invalid request queryString', err)
    default:
      throw new InvalidRequestBodyError('Invalid request body', err)
  }
}

export const validate = (schema: ValidationSchema): Koa.Middleware => async (ctx: Koa.ParameterizedContext, middleware: any): Promise<any> => { // eslint-disable-line max-len, @typescript-eslint/explicit-module-boundary-types
  ctx.valid = {}

  if (schema.body) {
    controllerValidator(ctx.request.body, schema.body)
  }

  if (schema.query) {
    const parsedQuery = qs.parse(ctx.querystring)
    controllerValidator(parsedQuery, schema.query, ValidationTypes.queryString)
  }

  if (schema.params) {
    controllerValidator(ctx.params, schema.params, ValidationTypes.params)
  }

  await middleware()
}
