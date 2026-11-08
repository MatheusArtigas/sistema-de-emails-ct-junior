import { resolve } from 'node:path'
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import { rotas } from './http/routes.js'
import fastifyJwt from '@fastify/jwt'
import { env } from './env/index.js'
import 'temporal-polyfill/global'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { configurarTratamentoDeErros } from './errors/error-handler.js'
import  multipart  from '@fastify/multipart'

export const app = Fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET
})

app.register(cors, {
  origin: true,
})

app.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
})

app.register(fastifyStatic, {
  root: resolve('uploads'),
  prefix: '/uploads/',
  decorateReply: false,
  index: false,
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
