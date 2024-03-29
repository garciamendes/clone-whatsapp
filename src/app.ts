import Fastify from 'fastify'
import FastifyJWT from '@fastify/jwt'
import FastifyCookie from '@fastify/cookie'
import FastifyCors from '@fastify/cors'
import FastifyWebsocket from '@fastify/websocket'
import { ZodError } from 'zod'
import { env } from '@/env'
import { routesAccount } from './http/controllers/routes'
import { routesWs } from './http/ws/routes'

export const fastify = Fastify()

fastify.register(FastifyCors, {
  origin: env.CORS_ORIGIN
})
fastify.register(FastifyJWT, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '1d'
  }
})
fastify.register(FastifyCookie)
fastify.register(FastifyWebsocket)

// Routes
fastify.register(routesAccount, { prefix: 'api/account' })

// Routes ws
fastify.register(routesWs, { prefix: 'api/ws' })


fastify.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: 'Validation error: ', issues: error.issues })
  }

  if (env.NODE_ENV !== 'production') {
    console.log(error)
  }

  return reply.status(500).send({ message: 'Internal server error' })
})