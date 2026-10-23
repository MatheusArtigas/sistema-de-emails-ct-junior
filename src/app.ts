import Fastify from 'fastify'
import { UsuarioJaExiste } from './errors/usuario-ja-existe.js'
import { rotas } from './http/routes.js'

export const app = Fastify()

const tratamentoPadraoDeErros = app.errorHandler

app.setErrorHandler(function (error, request, reply) {
  if (error instanceof UsuarioJaExiste) {
    return reply.status(409).send({ message: error.message })
  }

  tratamentoPadraoDeErros.call(this, error, request, reply)
})

app.register(rotas)
