import * as moment from 'moment'
import * as jwt from 'jsonwebtoken'
import { config } from '@app/config'

const generateRefreshToken = (userId: number): string =>
  jwt.sign({ userId }, config.auth.pepper, { expiresIn: config.auth.refreshTokenExpiration, algorithm: 'HS256' })

const calculateExpiration = (issuedAt: Date): Date =>
  moment(issuedAt).add(config.auth.refreshTokenExpiration, 'seconds').toDate()

export interface RefreshToken {
  token: string
  issuedAt: Date
  expiresAt: Date
  revokedAt: Date | null
  ipAddress?: string
  userAgent?: string
  userId: number
}

export const newRefreshToken = (userId: number, ipAddress?: string): RefreshToken => {
  if (!userId) {
    throw new Error('Missing userId when creating refreshToken')
  }
  const issuedAt = new Date()

  return {
    token: generateRefreshToken(userId),
    issuedAt,
    expiresAt: calculateExpiration(issuedAt),
    revokedAt: null,
    ipAddress,
    userId,
  }
}
