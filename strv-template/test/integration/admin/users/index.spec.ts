import { expect } from 'chai'
import { UserRole } from '@app/utils/enums'
import { createUserWithTokens } from '@data/users'
import { request } from '@integration/utils'
import { User } from '@app/database/models/user'

describe('Users', () => {
  let accessToken: string
  let user: User

  beforeEach(async () => {
    void ({ accessToken, user } = await createUserWithTokens({ fakeName: 'batman', role: UserRole.admin }))
  })

  describe('GET /admin/users', () => {
    it('responds with paginated list of all users', async () => {
      const res = await request()
        .get('/admin/users')
        .set('Authorization', accessToken)
        .expect(200)

      expect(res.body).to.have.property('results')
      expect(res.body).to.have.property('total', 1)
    })

    it('responds user object in results array', async () => {
      const res = await request()
        .get('/admin/users')
        .set('Authorization', accessToken)
        .expect(200)

      expect(res.body.results).to.have.length(1)
      expect(res.body.results[0].id).to.be.equal(user.id)
      expect(res.body.results[0].email).to.be.equal(user.email)
      expect(res.body.results[0].role).to.be.equal(user.role)
    })

    it('responds with 422 error when query validation fails for pagination', async () => {
      const res = await request()
        .get('/admin/users?page=one&pageSize=two')
        .set('Authorization', accessToken)
        .expect(422)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with 422 error when query validation fails for ordering', async () => {
      const res = await request()
        .get('/admin/users?orderColumn=foo&orderDirection=bar')
        .set('Authorization', accessToken)
        .expect(422)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with 403 error when user is not admin', async () => {
      const { accessToken: userToken } = await createUserWithTokens({ fakeName: 'superman' })

      const res = await request()
        .get('/admin/users')
        .set('Authorization', userToken)
        .expect(403)

      expect(res.body).to.matchSnapshot()
    })

    it('responds with 401 error when user is not authenticated', async () => {
      const res = await request()
        .get('/admin/users')
        .expect(401)

      expect(res.body).to.matchSnapshot()
    })
  })
})
