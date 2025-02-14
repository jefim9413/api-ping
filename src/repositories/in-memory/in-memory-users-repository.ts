import { Prisma, Role, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public itens: User[] = []

  async findById(id: string) {
    const user = this.itens.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.itens.push(user)
    return user
  }

  async findByEmail(email: string) {
    const user = this.itens.find((item) => item.email === email)
    if (!user) {
      return null
    }

    return user
  }
}
