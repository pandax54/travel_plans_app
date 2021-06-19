import * as timekeeper from 'timekeeper'
import { expect } from 'chai'
import { createUserWithTokens } from '@data/users'
import { request } from '@integration/utils'

describe('Sessions', () => {
  describe('POST /v1/sessions/refresh', () => {
    it('responds with tokens and user', async () => {
      const { refreshToken } = await createUserWithTokens()

      const res = await request()
        .post('/v1/sessions/refresh')
        .send({ refreshToken })
        .expect(201)


      expect(res.body).to.have.keys('accessToken', 'accessTokenExpiresAt')
    })

    it('responds with error 401 when token was already revoked', async () => {
      const { accessToken, refreshToken } = await createUserWithTokens()

      // logout
      await request()
        .post('/v1/sessions/destroy')
        .set('Authorization', accessToken)
        .send({ refreshToken })
        .expect(204)

      // refresh
      const res = await request()
        .post('/v1/sessions/refresh')
        .send({ refreshToken })
        .expect(401)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with error 422 when not all required params are in body', async () => {
      const res = await request()
        .post('/v1/sessions/refresh')
        .send({})
        .expect(422)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with error 404 when user cannot be found using refresh token', async () => {
      const res = await request()
        .post('/v1/sessions/refresh')
        .send({ refreshToken: 'fakeToken' })
        .expect(404)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with error 401 when refresh token is expired', async () => {
      const { refreshToken } = await createUserWithTokens({
        fakeName: 'batman',
      })
      const twoMonthsInMilliseconds = 5259600000
      const futureDate = new Date(Date.now() + twoMonthsInMilliseconds)
      timekeeper.travel(futureDate)

      const res = await request()
        .post('/v1/sessions/refresh')
        .send({ refreshToken })
        .expect(401)

      timekeeper.reset()
      expect(res.body).to.matchSnapshot()
    })
  })
})
