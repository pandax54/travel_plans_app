import { userRepository } from '@repositories/user'
import { User } from '@models/user'
import { Operation } from '@operations/operation'
import { needUser } from '@operations/helpers'

interface UpdateData {
  email: string
  role: string
}

interface OperationInput {
  userId: number
  updateData: UpdateData
}

class UpdateUser extends Operation<OperationInput, User> {
  protected async run(requestData: OperationInput): Promise<User> {
    const user = needUser(await userRepository.findById(requestData.userId))

    return await userRepository.patchById(user.id, requestData.updateData)
  }
}

export const updateUser = new UpdateUser()
