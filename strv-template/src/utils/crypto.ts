import * as crypto from 'crypto'
import * as bcrypt from 'bcrypt'
import { config } from '@app/config'

const pepperify = (str: string): string =>
  crypto
    .createHmac('sha1', config.auth.pepper)
    .update(str)
    .digest('hex')

export const hashPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(pepperify(password), config.auth.saltRounds)

export const comparePasswords = async (plaintext: string, ciphertext: string): Promise<boolean> =>
  await bcrypt.compare(pepperify(plaintext), ciphertext)

export const generateCommonToken = (): string =>
  crypto.randomBytes(config.auth.commonTokenLength).toString('hex')
