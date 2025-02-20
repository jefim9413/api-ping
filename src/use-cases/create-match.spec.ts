import { expect, describe, it, beforeEach } from 'vitest'
import { SamePlayerError } from '@/use-cases/errors/same-player-error'
import { InMemoryMatchRepository } from '@/repositories/in-memory/in-memory-match-repository'
import { CreateMatchUseCase } from './create-match'

let matchRepository: InMemoryMatchRepository
let createMatchUseCase: CreateMatchUseCase

describe('Create Match Use Case', () => {
  beforeEach(() => {
    matchRepository = new InMemoryMatchRepository()
    createMatchUseCase = new CreateMatchUseCase(matchRepository)
  })

  it('should create a match successfully', async () => {
    const { match } = await createMatchUseCase.execute({
      player1Id: 'player-1-id',
      player2Id: 'player-2-id',
      score1: 10,
      score2: 5,
    })

    expect(match).toBeDefined()
    expect(match.id).toBeDefined()
    expect(match.player1Id).toBe('player-1-id')
    expect(match.player2Id).toBe('player-2-id')
    expect(match.winnerId).toBe('player-1-id')
    expect(match.score1).toBe(10)
    expect(match.score2).toBe(5)
  })

  it('should set winnerId to null if scores are equal', async () => {
    const { match } = await createMatchUseCase.execute({
      player1Id: 'player-1-id',
      player2Id: 'player-2-id',
      score1: 7,
      score2: 7,
    })

    expect(match.winnerId).toBeNull()
  })

  it('should throw SamePlayerError if both players are the same', async () => {
    await expect(() =>
      createMatchUseCase.execute({
        player1Id: 'player-1-id',
        player2Id: 'player-1-id',
        score1: 10,
        score2: 5,
      }),
    ).rejects.toBeInstanceOf(SamePlayerError)
  })
})
