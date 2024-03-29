import { FastifyInstance } from 'fastify'
import { inviteAddUser } from './inivitation-received'
import { verifyJWT } from '../middlewares/verify-jwt'
import { conversationGet } from './conversation-received'

export const routesWs = async (route: FastifyInstance) => {
  // onRequest: [verifyJWT]
  route.get('/account/:email_friend', { websocket: true }, inviteAddUser)
  route.get('/account/conversation/:secretKey', { websocket: true }, conversationGet)
}