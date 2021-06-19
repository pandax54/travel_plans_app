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

  describe('DELETE /admin/users/:id', () => {
    it('responds with no content', async () => {
      const res = await request()
        .delete(`/admin/users/${user.id.toString()}`)
        .set('Authorization', adminToken)
        .expect(204)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with 422 error when params validation fails', async () => {
      const res = await request()
        .delete('/admin/users/one')
        .set('Authorization', adminToken)
        .expect(422)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with 404 error when user does not exist', async () => {
      const res = await request()
        .delete('/admin/users/999')
        .set('Authorization', adminToken)
        .expect(404)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with 403 error when user is not admin', async () => {
      const res = await request()
        .delete(`/admin/users/${user.id.toString()}`)
        .set('Authorization', userToken)
        .expect(403)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with 401 error when user is not authenticated', async () => {
      const res = await request()
        .delete(`/admin/users/${user.id.toString()}`)
        .expect(401)

      expect(res.body).to.matchSnapshot()
    })
  })
})
