import type { FastifyInstance } from 'fastify'
import { UsuarioJaExiste } from './usuario-ja-existe.js'
import { ErroDeAutenticacao } from './erro-de-autenticacao.js'
import { EmailNaoEncontrado } from './erro-email-nao-encontrado.js'
import { NaoAutorizado } from './erro-nao-autorizado.js'
import { DestinatarioNaoEncontrado } from './erro-destinatario-nao-encontrado.js'

export function configurarTratamentoDeErros(app: FastifyInstance) {
  const tratamentoPadraoDeErros = app.errorHandler

  app.setErrorHandler(function (error, request, reply) {
    if (error instanceof UsuarioJaExiste) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof ErroDeAutenticacao) {
      return reply.status(401).send({ message: error.message })
    }

    if (error instanceof EmailNaoEncontrado) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof NaoAutorizado) {
      return reply.status(401).send({ message: error.message })
    }

    if (error instanceof DestinatarioNaoEncontrado) {
      return reply.status(404).send({ message: error.message })
    }

    return tratamentoPadraoDeErros.call(this, error, request, reply)
  })
}
