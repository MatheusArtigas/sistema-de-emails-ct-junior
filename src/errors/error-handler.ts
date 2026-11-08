import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { UsuarioJaExiste } from './usuario-ja-existe.js'
import { ErroDeAutenticacao } from './erro-de-autenticacao.js'
import { EmailNaoEncontrado } from './erro-email-nao-encontrado.js'
import { NaoAutorizado } from './erro-nao-autorizado.js'
import { DestinatarioNaoEncontrado } from './erro-destinatario-nao-encontrado.js'
import { FormatoInvalido } from './erro-formato-da-imagem.js'
import { UsuarioNaoEncontrado } from './usuario-nao-encontrado.js'
import { TipoDeUploadInvalido } from './erro-tipo-de-upload.js'
import { FotoNaoEnviada } from './erro-foto-nao-enviada.js'

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

    if (error instanceof UsuarioNaoEncontrado) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof NaoAutorizado) {
      return reply.status(401).send({ message: error.message })
    }

    if (error instanceof DestinatarioNaoEncontrado) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof FormatoInvalido) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof TipoDeUploadInvalido) {
      return reply.status(415).send({ message: error.message })
    }

    if (error instanceof FotoNaoEnviada) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof ZodError) {
      const message = error.issues[0]?.message ?? error.message
      return reply.status(400).send({ message })
    }

    return tratamentoPadraoDeErros.call(this, error, request, reply)
  })
}
