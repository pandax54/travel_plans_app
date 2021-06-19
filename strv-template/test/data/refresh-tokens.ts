import { refreshTokenRepository } from '@repositories/refresh-token'
import { newRefreshToken } from '@services/internal/refresh-tokens'
import { RefreshToken } from '@models/refresh-token'

export const createTokens = async (userId: number): Promise<RefreshToken> =>
  await refreshTokenRepository.insert(newRefreshToken(userId, '1.1.1.1')).returning('*')
