import type { FastifyInstance } from 'fastify'
import { registroDeUsuarios } from './controllers/registro-de-usuario.js'

export async function rotas(app: FastifyInstance) {
  app.post('/user', registroDeUsuarios)
}
