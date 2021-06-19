import { Model, Pojo } from 'objection'
import * as R from 'ramda'

interface IJSONTransformRules {
  omit?: string[]
  transformations?: R.Evolver
}

export class BaseModel extends Model {
  readonly id!: number
  createdAt!: Date
  updatedAt!: Date
  deletedAt?: Date

  protected $transformJSON: IJSONTransformRules = {
    omit: ['deletedAt'],
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date()
  }

  $formatJson(json: Pojo): Pojo {
    json = super.$formatJson(json)

    if (this.$transformJSON.omit) {
      json = R.omit(this.$transformJSON.omit, json)
    }

    if (this.$transformJSON.transformations) {
      json = R.evolve(this.$transformJSON.transformations, json)
    }

    return json
  }
}
