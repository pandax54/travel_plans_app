import { expect } from 'chai'
import { batman, createUser } from '@data/users'
import { request } from '@integration/utils'

describe('Users', () => {
  describe('POST /v1/users', () => {
    it('responds with tokens and user', async () => {
      const res = await request()
        .post('/v1/users')
        .send(batman)
        .expect(201)

      expect(res.body).to.have.keys([
        'accessToken',
        'accessTokenExpiresAt',
        'refreshToken',
        'refreshTokenExpiresAt',
        'user',
      ])
      expect(res.body.user).to.have.property('email', batman.email)
    })

    it('responds with error 422 when not all required params are in body', async () => {
      const res = await request()
        .post('/v1/users')
        .send({ email: batman.email })
        .expect(422)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with error 409 when user already exists in database', async () => {
      await createUser()

      const res = await request()
        .post('/v1/users')
        .send({ ...batman, email: batman.email.toUpperCase() })
        .expect(409)

      expect(res.body).to.matchSnapshot()
    })
  })
})
