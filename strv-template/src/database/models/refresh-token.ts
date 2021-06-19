import { join } from 'path'
import { Model, RelationMappings } from 'objection'
import { BaseModel } from '@models/base'

export class RefreshToken extends BaseModel {
  static tableName = 'refreshTokens'

  token: string
  issuedAt: Date
  expiresAt: Date
  revokedAt: Date | null
  ipAddress?: string
  userId: number

  static relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: join(__dirname, 'user'),
        join: {
          from: 'users.id',
          to: 'refreshTokens.userId',
        },
      },
    }
  }
}
