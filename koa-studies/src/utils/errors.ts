/* eslint-disable max-classes-per-file */

import * as jsonschema from 'jsonschema'

export class ApiError extends Error {
  statusCode: number
  type: string
  errors?: jsonschema.ValidationError[]

  constructor(type: string, message: string, statusCode?: number) {
    super(message)

    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.type = type
    this.statusCode = Number(statusCode ?? 500)
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, type?: string) {
    super(type ?? 'E_BAD_REQUEST', message, 400)
  }
}

export class ValidationError extends ApiError {
  constructor(type: string, message: string, errors?: jsonschema.ValidationError[]) {
    super(type, message, 422)

    if (errors) {
      this.errors = errors
    }
  }
}

export class InvalidRequestError extends ValidationError {
  constructor(message: string, errors?: jsonschema.ValidationError[]) {
    super('E_INVALID_REQUEST', message, errors)
  }
}

export class InvalidRequestBodyError extends ValidationError {
  constructor(message: string, errors?: jsonschema.ValidationError[]) {
    super('E_INVALID_BODY', message, errors)
  }
}

export class InvalidRequestParamsError extends ValidationError {
  constructor(message: string, errors?: jsonschema.ValidationError[]) {
    super('E_INVALID_PARAMS', message, errors)
  }
}

export class InvalidRequestQueryStringError extends ValidationError {
  constructor(message: string, errors?: jsonschema.ValidationError[]) {
    super('E_INVALID_QUERY_STRING', message, errors)
  }
}

export class InvalidCredentialsError extends BadRequestError {
  constructor(message: string) {
    super(message, 'E_INVALID_CREDENTIALS')
  }
}

export class ConflictError extends ApiError {
  constructor(message: string, type?: string) {
    super(type ?? 'E_CONFLICT', message, 409)
  }
}

export class ForbiddenError extends ApiError {
  // eslint-disable-next-line default-param-last
  constructor(message = 'The user is not allowed to access this resource', type?: string) {
    super(type ?? 'E_FORBIDDEN', message, 403)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'The user was not authorized', type = 'E_UNAUTHORIZED') {
    super(type, message, 401)
  }
}

export class RecordNotFoundError extends ApiError {
  constructor(message: string, type?: string) {
    super(type ?? 'E_NOT_FOUND', message, 404)
  }
}

export class UserNotFoundError extends RecordNotFoundError {
  constructor(userId?: number) {
    super(userId ? `User '${userId.toString()}' does not exist` : 'User does not exist', 'E_USER_NOT_FOUND')
  }
}

export class RefreshTokenExpiredError extends UnauthorizedError {
  constructor(message = 'Refresh token expired, new login required') {
    super(message, 'E_REFRESH_TOKEN_EXPIRED')
  }
}

export class InternalServerError extends UnauthorizedError {
  constructor(message = 'Internal server error') {
    super(message, 'E_INTERNAL_SERVER_ERROR')
  }
}
