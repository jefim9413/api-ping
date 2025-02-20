import { FastifyInstance } from 'fastify'
import { createMatch } from './create-match'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function matchRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.post('/matches', createMatch)
}
