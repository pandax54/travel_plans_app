import { userRepository } from '@repositories/user'
import { User } from '@models/user'
import { Operation } from '@operations/operation'
import { needUser } from '@operations/helpers'

export type Input = Pick<User, 'id'> & {
  updateData: Pick<User, 'password'>
}

class UpdateUser extends Operation<Input, User> {
  protected async run(requestData: Input): Promise<User> {
    const user = needUser(await userRepository.findById(requestData.id))

    return await userRepository.patchById(user.id, requestData.updateData)
  }
}

export const updateUser = new UpdateUser()
