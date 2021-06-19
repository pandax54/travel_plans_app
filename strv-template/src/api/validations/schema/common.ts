export const page = { type: 'string', format: 'positiveInteger' }

export const pageSize = { type: 'string', format: 'positiveInteger' }

export const orderColumn = { type: 'string', enum: ['id', 'createdAt', 'email'] }

export const orderDirection = { type: 'string', enum: ['asc', 'desc'] }
