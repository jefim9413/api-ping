import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class registerUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute(data: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {

    const user = await this.usersRepository.create(data)

    return {
      user
    }
  }
}
