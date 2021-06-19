import { Knex } from 'knex'
import { UserRole } from '@app/utils/enums'

const testUsers = [
  {
    email: 'admin@example.com',
    password: '$2b$10$nkVLKOopAct78J9Q1qo.CujZz8lTZPq5ynmi.Y4eQRAO.Edw/t.ky',
    role: UserRole.admin,
  },
]

exports.seed = async (knex: Knex) => {
  await knex('users').insert(testUsers)
}
