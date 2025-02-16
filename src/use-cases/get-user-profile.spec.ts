import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should return user profile if user exists', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: '123456',
    })

    const { user } = await sut.execute(createdUser.id)

    expect(user).toHaveProperty('id')
    expect(user.name).toEqual('John Doe')
    expect(user.email).toEqual('johndoe@example.com')
  })

  it('should not return user profile if user does not exist', async () => {
    await expect(sut.execute('non-existing-user-id')).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
