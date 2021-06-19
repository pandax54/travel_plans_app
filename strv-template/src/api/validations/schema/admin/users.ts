import { userRoleValues } from '@app/utils/enums'
import { page, orderColumn, orderDirection, pageSize } from '@app/api/validations/schema/common'

export const idParam = {
  type: 'Object',
  properties: { id: { type: 'string', format: 'numericId' } },
  required: ['id'],
}

export const listQueryParams = {
  type: 'Object',
  properties: {
    page,
    pageSize,
    orderColumn,
    orderDirection,
  },
}

export const update = {
  type: 'Object',
  properties: {
    password: { type: 'string', format: 'password' },
    email: { type: 'string', format: 'email' },
    role: { type: 'string', enum: userRoleValues },
  },
  additionalProperties: false,
}
