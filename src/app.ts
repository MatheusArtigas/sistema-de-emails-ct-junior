import Fastify from 'fastify'
import { UsuarioJaExiste } from './errors/usuario-ja-existe.js'
import { ErroDeAutenticacao } from './errors/erro-de-autenticacao.js'
import { rotas } from './http/routes.js'
import fastifyJwt from '@fastify/jwt'
import { env } from './env/index.js'
import { EmailNaoEncontrado } from './errors/erro-email-nao-encontrado.js'
import { NaoAutorizado } from './errors/erro-nao-autorizado.js'
import 'temporal-polyfill/global'
import { DestinatarioNaoEncontrado } from './errors/erro-destinatario-nao-encontrado.js'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { configurarTratamentoDeErros } from './errors/error-handler.js'

export const app = Fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET
})

app.register(cors, {
  origin: true,
})

app.register(swagger, {
  openapi: {
    info: {
      title: 'Sistema de Emails',
      description: 'Documentação da API de emails',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
})

app.register(swaggerUI, {
  routePrefix: '/docs',
})

const tratamentoPadraoDeErros = app.errorHandler

configurarTratamentoDeErros(app)

app.register(rotas)
