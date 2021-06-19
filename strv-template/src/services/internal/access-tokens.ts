import * as moment from 'moment'
import * as jwt from 'jsonwebtoken'
import { config } from '@app/config'

const generateAccessToken = (userId: number): string =>
  jwt.sign({ userId }, config.auth.pepper, { expiresIn: config.auth.accessTokenExpiration, algorithm: 'HS256' })

export interface AccessToken {
  token: string
  expiresAt: Date
}

export const generateNewAccessToken = (userId: number): AccessToken => ({
  token: generateAccessToken(userId),
  expiresAt: moment().add(config.auth.accessTokenExpiration, 'seconds').toDate(),
})
