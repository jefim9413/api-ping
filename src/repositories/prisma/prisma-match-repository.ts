import { Prisma } from '@prisma/client'
import { MatchRepository } from '../match-repository'
import { prisma } from '@/lib/prisma'

export class PrismaMatchRepository implements MatchRepository {
  async findById(id: string) {
    const match = await prisma.match.findUnique({
      where: {
        id,
      },
    })
    return match
  }

  async updateMatch(id: string, data: Prisma.MatchUpdateInput) {
    return await prisma.match.update({
      where: {
        id,
      },
      data,
    })
  }

  async deleteMatch(id: string) {
    await prisma.match.delete({
      where: {
        id,
      },
    })
  }

  async listMatches(page: number) {
    const matches = await prisma.match.findMany({
      take: 20,
      skip: (page - 1) * 20,
    })
    return matches
  }

  async create(data: Prisma.MatchCreateInput) {
    const match = await prisma.match.create({
      data,
    })
    return match
  }
}
