import { SamePlayerError } from '@/use-cases/errors/same-player-error'
import { makeCreateMatch } from '@/use-cases/factories/make-create-match'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createMatch(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const matchSchema = z.object({
    player1Id: z.string().uuid(),
    player2Id: z.string().uuid(),
    score1: z.number().min(0),
    score2: z.number().min(0),
  })

  const match = matchSchema.parse(request.body)

  try {
    const createMatchUseCase = makeCreateMatch()

    const { match: createdMatch } = await createMatchUseCase.execute(match)

    return reply.status(201).send({ match: createdMatch })
  } catch (err) {
    if (err instanceof SamePlayerError) {
      return reply.status(400).send({ message: err.message })
    }
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
