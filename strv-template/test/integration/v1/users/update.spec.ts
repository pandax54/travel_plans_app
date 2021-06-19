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

  describe('PATCH /v1/users/me', () => {
    it('responds with tokens and user', async () => {
      const res = await request()
        .patch('/v1/users/me')
        .set('Authorization', accessToken)
        .send({ password: 'newPassword' })
        .expect(200)

      expect(res.body).to.have.keys(['createdAt', 'email', 'id', 'role', 'updatedAt'])
      expect(res.body.id).to.be.equal(user.id)
      expect(res.body.email).to.be.equal(user.email)
      expect(res.body.role).to.be.equal(user.role)
    })

    it('responds with 422 error when unexpected attributes are in body but without updating', async () => {
      const res = await request()
        .patch('/v1/users/me')
        .set('Authorization', accessToken)
        .send({ name: 'Bruce' })
        .expect(422)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with 401 error when user is not authenticated', async () => {
      const res = await request()
        .patch('/v1/users/me')
        .send({ password: 'newPassword' })
        .expect(401)

      expect(res.body).to.matchSnapshot()
    })
  })
})
