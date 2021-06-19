import { userRepository } from '@repositories/user'
import { User } from '@models/user'
import { Operation } from '@operations/operation'
import { needUser } from '@operations/helpers'

interface OperationInput {
  userId: number
}

class GetUser extends Operation<OperationInput, User> {
  protected async run(requestData: OperationInput): Promise<User> {
    return needUser(await userRepository.findById(requestData.userId))
  }
}

export const getUser = new GetUser()
