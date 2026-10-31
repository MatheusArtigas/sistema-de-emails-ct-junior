import type { FastifyInstance } from 'fastify'
import { registroDeUsuarios } from './controllers/registro-de-usuario.js'
import { autenticacao } from './controllers/autenticacao.js'
import { verificarJWT } from './middlewares/verifica-jwt.js'
import { deletarEmail, meusEmails } from './controllers/meus-emails.js'
import { atualizarFoto, atualizarNome } from './controllers/atualizar-perfil.js'
import { enviarEmail } from './controllers/mandar-email.js'

export async function rotas(app: FastifyInstance) {
  app.post('/user', registroDeUsuarios)
  app.post('/login', autenticacao)

  app.get('/my-emails', {  
  onRequest: [verificarJWT]
  }, meusEmails)

  app.patch('/my-image', {
    onRequest: [verificarJWT]
  }, atualizarFoto)

  app.patch('/my-name', {
    onRequest: [verificarJWT]
  }, atualizarNome)

  app.delete('/email/:id', {
    onRequest: [verificarJWT]
  }, deletarEmail)

  app.post('/email', {
    onRequest: [verificarJWT]
  }, enviarEmail)
}
