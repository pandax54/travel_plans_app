import * as moment from 'moment'
import { AccessToken } from '@services/internal/access-tokens'

export interface SerializedAccessToken {
  accessToken: string
  accessTokenExpiresAt: Date | moment.Moment
}

export const serializeAccessToken = (accessToken: AccessToken): SerializedAccessToken => ({
  accessToken: accessToken.token,
  accessTokenExpiresAt: accessToken.expiresAt,
})
