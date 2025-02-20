import request from 'supertest'
import { app } from '@/app'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Match (E2E)', () => {
  let player1Id: string
  let player2Id: string
  let authToken: string

  beforeAll(async () => {
    await app.ready()

    await request(app.server).post('/register').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const player1 = await prisma.user.create({
      data: {
        name: 'Player 1',
        email: 'player1@example.com',
        passwordHash: 'hashed-password-1',
      },
    })

    const player2 = await prisma.user.create({
      data: {
        name: 'Player 2',
        email: 'player2@example.com',
        passwordHash: 'hashed-password-2',
      },
    })

    player1Id = player1.id
    player2Id = player2.id
  })

  afterAll(async () => {
    await prisma.match.deleteMany()
    await prisma.user.deleteMany()
    await app.close()
  })

  it('should create a match successfully with authentication', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const response = await request(app.server)
      .post('/matches')
      .set('Authorization', `Bearer ${token}`)
      .send({
        player1Id,
        player2Id,
        score1: 10,
        score2: 7,
      })

    expect(response.status).toBe(201)
    expect(response.body.match).toHaveProperty('id')
    expect(response.body.match.player1Id).toBe(player1Id)
    expect(response.body.match.player2Id).toBe(player2Id)
  })

  it('should return 401 if not authenticated', async () => {
    const response = await request(app.server).post('/matches').send({
      player1Id,
      player2Id,
      score1: 10,
      score2: 5,
    })

    expect(response.status).toBe(401)
  })
})
