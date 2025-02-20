import { MatchRepository } from '@/repositories/match-repository'
import { Match } from '@prisma/client'
import { SamePlayerError } from './errors/same-player-error'

interface CreateMatchUseCaseRequest {
  player1Id: string
  player2Id: string
  score1: number
  score2: number
}

interface CreateMatchUseCaseResponse {
  match: Match
}
export class CreateMatchUseCase {
  constructor(private matchesRepository: MatchRepository) {}

  async execute({
    player1Id,
    player2Id,
    score1,
    score2,
  }: CreateMatchUseCaseRequest): Promise<CreateMatchUseCaseResponse> {
    if (player1Id === player2Id) {
      throw new SamePlayerError()
    }

    const winnerId =
      score1 > score2 ? player1Id : score1 < score2 ? player2Id : null
    const match = await this.matchesRepository.create({
      player1: {
        connect: {
          id: player1Id,
        },
      },
      player2: {
        connect: {
          id: player2Id,
        },
      },
      score1,
      score2,
      winner: winnerId ? { connect: { id: winnerId } } : undefined,
    })

    return {
      match,
    }
  }
}
