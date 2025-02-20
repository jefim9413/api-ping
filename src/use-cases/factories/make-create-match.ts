import { PrismaMatchRepository } from '@/repositories/prisma/prisma-match-repository'
import { CreateMatchUseCase } from '../create-match'

export function makeCreateMatch() {
  const matchRepository = new PrismaMatchRepository()
  const createMatchUseCase = new CreateMatchUseCase(matchRepository)

  return createMatchUseCase
}
