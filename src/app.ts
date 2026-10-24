import Fastify from 'fastify'
import { UsuarioJaExiste } from './errors/usuario-ja-existe.js'
import { ErroDeAutenticacao } from './errors/erro-de-autenticacao.js'
import { rotas } from './http/routes.js'
import fastifyJwt from '@fastify/jwt'
import { env } from './env/index.js'

export const app = Fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET
})

const tratamentoPadraoDeErros = app.errorHandler

app.setErrorHandler(function (error, request, reply) {
  if (error instanceof UsuarioJaExiste) {
    return reply.status(409).send({ message: error.message })
  }

  if (error instanceof ErroDeAutenticacao) {
    return reply.status(401).send({ message: error.message })
  }

  tratamentoPadraoDeErros.call(this, error, request, reply)
})

app.register(rotas)
