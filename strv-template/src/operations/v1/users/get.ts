import { userRepository } from '@repositories/user'
import { User } from '@models/user'
import { Operation } from '@operations/operation'
import { needUser } from '@operations/helpers'

export type Input = Pick<User, 'id'>

class GetUser extends Operation<Input, User> {
  protected async run(requestData: Input): Promise<User> {
    return needUser(await userRepository.findById(requestData.id))
  }
}

export const getUser = new GetUser()
