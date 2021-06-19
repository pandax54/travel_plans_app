import { expect } from 'chai'
import { batman, createUser } from '@data/users'
import { request } from '@integration/utils'

describe('Sessions', () => {
  describe('POST /v1/sessions/native', () => {
    it('responds with tokens and user', async () => {
      await createUser()

      const res = await request()
        .post('/v1/sessions/native')
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

    it('responds with error 400 when credentials are wrong', async () => {
      await createUser()

      const res = await request()
        .post('/v1/sessions/native')
        .send({
          email: batman.email,
          password: 'wrongPassword',
        })
        .expect(400)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with error 404 when user cannot be found by email', async () => {
      const res = await request()
        .post('/v1/sessions/native')
        .send(batman)
        .expect(404)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with error 422 when not all required attributes are in body', async () => {
      const res = await request()
        .post('/v1/sessions/native')
        .send({
          email: batman.email,
        })
        .expect(422)

      expect(res.body).to.matchSnapshot()
    })
  })
})
