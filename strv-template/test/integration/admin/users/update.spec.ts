import { expect } from 'chai'
import { UserRole } from '@app/utils/enums'
import { createUserWithTokens } from '@data/users'
import { request } from '@integration/utils'
import { User } from '@models/user'

describe('Users', () => {
  let user: User
  let adminToken: string
  let userToken: string

  beforeEach(async () => {
    void ({ accessToken: adminToken } = await createUserWithTokens({ fakeName: 'batman', role: UserRole.admin }))
    void ({ user, accessToken: userToken } = await createUserWithTokens({ fakeName: 'superman' }))
  })

  describe('PATCH /admin/users/:id', () => {
    it('responds with updated user object', async () => {
      const res = await request()
        .patch(`/admin/users/${user.id.toString()}`)
        .set('Authorization', adminToken)
        .send({
          email: user.email,
          password: 'newpassword',
          role: UserRole.admin,
        })
        .expect(200)

      expect(res.body).to.have.keys(['createdAt', 'email', 'id', 'role', 'updatedAt'])
      expect(res.body.id).to.be.equal(user.id)
      expect(res.body.email).to.be.equal(user.email)
      expect(res.body.role).to.be.equal(UserRole.admin)
    })

    it('responds with 422 error when body validation fails', async () => {
      const res = await request()
        .patch('/admin/users/one')
        .set('Authorization', adminToken)
        .send({
          email: user.email,
          password: 'newpassword',
          role: 'guest',
          name: 'Clark',
        })
        .expect(422)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with 422 error when params validation fails', async () => {
      const res = await request()
        .patch('/admin/users/one')
        .set('Authorization', adminToken)
        .send({ role: UserRole.admin })
        .expect(422)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with 404 error when user does not exist', async () => {
      const res = await request()
        .patch('/admin/users/999')
        .set('Authorization', adminToken)
        .send({ role: UserRole.admin })
        .expect(404)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with 403 error when user is not admin', async () => {
      const res = await request()
        .patch(`/admin/users/${user.id.toString()}`)
        .set('Authorization', userToken)
        .send({ role: UserRole.admin })
        .expect(403)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with 401 error when user is not authenticated', async () => {
      const res = await request()
        .patch(`/admin/users/${user.id.toString()}`)
        .send({ role: UserRole.admin })
        .expect(401)

      expect(res.body).to.matchSnapshot()
    })
  })
})
