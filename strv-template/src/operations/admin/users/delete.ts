import { userRepository } from '@repositories/user'
import { User } from '@models/user'
import { needUser } from '@operations/helpers'
import { Operation } from '@operations/operation'

interface OperationInput {
  userId: number
}

class DeleteUser extends Operation<OperationInput, User> {
  protected async run(requestData: OperationInput): Promise<User> {
    const user = needUser(await userRepository.findById(requestData.userId))
    return await userRepository.deleteById(user.id)
  }
}

export const deleteUser = new DeleteUser()
