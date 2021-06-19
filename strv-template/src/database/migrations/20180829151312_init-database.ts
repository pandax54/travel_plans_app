import { Knex } from 'knex'
import {
  UserRole,
  userRoleValues,
} from '@app/utils/enums'
import * as constraints from '@app/config/schema-constraints'

exports.up = async (knex: Knex) => {
  const createIdAndTimestamps = (table: Knex.CreateTableBuilder): void => {
    table.increments('id').primary()
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now())
    table.dateTime('deletedAt').index()
  }

  await knex.schema
    // --- users -----------------
    .createTable('users', table => {
      createIdAndTimestamps(table)
      table.string('email', constraints.user.emailMaxLength).notNullable().unique()
      table.string('password', constraints.user.passwordMaxLength).notNullable()
      table.enu('role', userRoleValues).notNullable().defaultTo(UserRole.user)
    })

  await knex.schema
  // --- refresh_tokens -----------------
    .createTable('refreshTokens', table => {
      createIdAndTimestamps(table)
      table.string('token', constraints.common.tokens)
        .notNullable()
        .unique()
        .index()
      table.dateTime('issuedAt').notNullable()
      table.dateTime('expiresAt').notNullable()
      table.dateTime('revokedAt')
      table.string('ipAddress', constraints.common.ipAddress)
      table.integer('userId').notNullable().unsigned()
      table.foreign('userId').references('users.id')
        .onDelete('restrict')
        .onUpdate('restrict')
    })
}

exports.down = (knex: Knex) =>
  knex.schema
    .dropTableIfExists('refreshTokens')
    .dropTableIfExists('users')
