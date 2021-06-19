import { expect } from 'chai'
import { createUserWithTokens } from '@data/users'
import { request } from '@integration/utils'

describe('Sessions', () => {
  describe('DELETE /v1/sessions', () => {
    let accessToken: string
    let refreshToken: string

    beforeEach(async () => {
      void ({ accessToken, refreshToken } = await createUserWithTokens())
    })

    it('responds with no content', async () => {
      const res = await request()
        .post('/v1/sessions/destroy')
        .set('Authorization', accessToken)
        .send({ refreshToken })
        .expect(204)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with 401 error when user is not authenticated', async () => {
      const res = await request()
        .post('/v1/sessions/destroy')
        .expect(401)

      expect(res.body).to.matchSnapshot()
    })
  })
})
