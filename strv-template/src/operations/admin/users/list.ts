import { userRepository, FilterOptions, PaginatedUserList } from '@repositories/user'
import { Operation } from '@operations/operation'

class ListUsers extends Operation<FilterOptions, PaginatedUserList> {
  protected async run(requestData: FilterOptions): Promise<PaginatedUserList> {
    return await userRepository.findForAdmin(requestData)
  }
}

export const listUsers = new ListUsers()
