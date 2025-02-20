import { Match, Prisma } from '@prisma/client'
import { MatchRepository } from '../match-repository'
import { randomUUID } from 'crypto'

export class InMemoryMatchRepository implements MatchRepository {
  public matches: Match[] = []

  async findById(id: string): Promise<Match | null> {
    return this.matches.find((match) => match.id === id) || null
  }

  async create(data: Prisma.MatchCreateInput) {
    const match = {
      id: randomUUID(),
      player1Id: data.player1.connect?.id || '',
      player2Id: data.player2.connect?.id || '',
      winnerId: data.winner?.connect?.id || null,
      score1: data.score1,
      score2: data.score2,
      createdAt: new Date(),
    }

    this.matches.push(match)
    return match
  }

  async listAll() {
    return this.matches
  }

  async delete(id: string): Promise<void> {
    this.matches = this.matches.filter((match) => match.id !== id)
  }

  async updateMatch(id: string, data: Prisma.MatchUpdateInput): Promise<Match> {
    const matchIndex = this.matches.findIndex((match) => match.id === id)
    this.matches[matchIndex] = {
      ...this.matches[matchIndex],
      ...{
        id: typeof data.id === 'string' ? data.id : this.matches[matchIndex].id,
        player1Id:
          typeof data.player1?.connect?.id === 'string'
            ? data.player1.connect.id
            : this.matches[matchIndex].player1Id,
        player2Id:
          typeof data.player2?.connect?.id === 'string'
            ? data.player2.connect.id
            : this.matches[matchIndex].player2Id,
        winnerId:
          typeof data.winner?.connect?.id === 'string'
            ? data.winner.connect.id
            : this.matches[matchIndex].winnerId,
        score1:
          typeof data.score1 === 'number'
            ? data.score1
            : this.matches[matchIndex].score1,
        score2:
          typeof data.score2 === 'number'
            ? data.score2
            : this.matches[matchIndex].score2,
        createdAt: this.matches[matchIndex].createdAt,
      },
    }

    return this.matches[matchIndex]
  }

  async listMatches(page: number) {
    return this.matches.slice((page - 1) * 20, page * 20)
  }

  async deleteMatch(id: string): Promise<void> {
    this.matches = this.matches.filter((match) => match.id !== id)
  }
}
