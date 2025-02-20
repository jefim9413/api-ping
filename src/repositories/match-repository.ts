import { Match, Prisma } from '@prisma/client'

export interface MatchRepository {
  create(data: Prisma.MatchCreateInput): Promise<Match>
  findById(id: string): Promise<Match | null>
  updateMatch(id: string, data: Prisma.MatchUpdateInput): Promise<Match>
  deleteMatch(id: string): Promise<void>
  listMatches(page: number): Promise<Match[]>
}
