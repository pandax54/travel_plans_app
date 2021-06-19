import { join } from 'path'
import { Pojo, Model, RelationMappings } from 'objection'
import { hashPassword } from '@app/utils/crypto'
import { UserRole } from '@app/utils/enums'
import { lowerCaseObjectProperty } from '@app/utils/helpers'
import { BaseModel } from '@models/base'

export class User extends BaseModel {
  static tableName = 'users'

  email: string
  password: string
  role: UserRole

  protected $transformJSON = {
    omit: ['password', 'deletedAt'],
  }

  static relationMappings(): RelationMappings {
    return {
      refreshToken: {
        relation: Model.HasManyRelation,
        modelClass: join(__dirname, 'refresh-token'),
        join: {
          from: 'users.id',
          to: 'refreshTokens.userId',
        },
      },
    }
  }

  async $beforeInsert(): Promise<void> {
    if (this.password) {
      this.password = await hashPassword(this.password) // eslint-disable-line require-atomic-updates
    }
  }

  async $beforeUpdate(): Promise<void> {
    super.$beforeUpdate()

    if (this.password) {
      this.password = await hashPassword(this.password) // eslint-disable-line require-atomic-updates
    }
  }

  $formatDatabaseJson(json: Pojo): Pojo {
    json = super.$formatDatabaseJson(json)

    return lowerCaseObjectProperty(json, 'email')
  }
}
