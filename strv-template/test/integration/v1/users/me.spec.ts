import { expect } from 'chai'
import { createUserWithTokens } from '@data/users'
import { request } from '@integration/utils'
import { User } from '@app/database/models/user'

describe('Users', () => {
  let user: User
  let accessToken: string

  beforeEach(async () => {
    void ({ accessToken, user } = await createUserWithTokens())
  })

  describe('GET /v1/users/me', () => {
    it('responds with tokens and user ', async () => {
      const res = await request()
        .get('/v1/users/me')
        .set('Authorization', accessToken)
        .expect(200)

      expect(res.body).to.have.keys(['id', 'createdAt', 'updatedAt', 'email', 'role'])
      expect(res.body.id).to.be.equal(user.id)
      expect(res.body.email).to.be.equal(user.email)
      expect(res.body.role).to.be.equal(user.role)
    })

    it('responds with error 401 when user is not authenticated', async () => {
      const res = await request()
        .get('/v1/users/me')
        .expect(401)

      expect(res.body).to.matchSnapshot()
    })
  })
})
