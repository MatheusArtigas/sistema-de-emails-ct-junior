import type { FastifyInstance } from 'fastify'
import { registroDeUsuarios } from './controllers/registro-de-usuario.js'
import { autenticacao } from './controllers/autenticacao.js'
import { verificarJWT } from './middlewares/verifica-jwt.js'
import { deletarEmail, meusEmails, verEmail } from './controllers/meus-emails.js'
import { atualizarFoto, atualizarNome } from './controllers/atualizar-perfil.js'
import { enviarEmail } from './controllers/mandar-email.js'
import { listarEmailsEnviados } from './controllers/emails-enviados.js'
import { verDadosCadastrais } from './controllers/dados-cadastrais.js'

export async function rotas(app: FastifyInstance) {
  app.post('/user', {
  schema: {
    tags: ['Usuarios'],
    summary: 'Cadastrar novo usuario',
    description: 'Cria um novo usuario no sistema',

    body: {
      type: 'object',
      required: ['nome', 'email', 'senha'],
      properties: {
        nome: { type: 'string' },
        email: { type: 'string', format: 'email' },
        senha: { type: 'string', minLength: 6 },
      },
    },

    response: {
      201: {
        type: 'null',
        description: 'Usuario criado com sucesso',
      },
    },
  },
  }, registroDeUsuarios)

  app.post('/login', {
  schema: {
    tags: ['Usuarios'],
    summary: 'Autenticar usuario',
    description: 'Autentica o usuario e retorna um token JWT',

    body: {
      type: 'object',
      required: ['email', 'senha'],
      properties: {
        email: { type: 'string', format: 'email' },
        senha: { type: 'string' },
      },
    },

    response: {
      200: {
        description: 'Usuario autenticado com sucesso',
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
      },
    },
  },
  }, autenticacao)

  app.get('/my-emails', {
  onRequest: [verificarJWT],
  schema: {
    tags: ['Emails'],
    summary: 'Listar emails recebidos',
    security: [{ bearerAuth: [] }],

    response: {
      200: {
        type: 'object',
        properties: {
          emails: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                titulo: { type: 'string' },
                enviado_por: { type: 'string' },
                jaVisto: { type: 'boolean' },
                email_id: { type: 'string', format: 'uuid' },
              },
            },
          },
        },
      },
    },
  },
  }, meusEmails)

  app.patch('/my-image', {
  onRequest: [verificarJWT],
  schema: {
    tags: ['Usuarios'],
    summary: 'Atualizar foto de perfil',
    security: [{ bearerAuth: [] }],

    body: {
      type: 'object',
      required: ['foto'],
      properties: {
        foto: { type: 'string', format: 'uri' },
      },
    },

    response: {
      204: {
        description: 'Foto atualizada com sucesso',
        type: 'null',
      },
    },
  },
  }, atualizarFoto)

  app.patch('/my-name', {
  onRequest: [verificarJWT],
  schema: {
    tags: ['Usuarios'],
    summary: 'Atualizar nome do usuario',
    security: [{ bearerAuth: [] }],

    body: {
      type: 'object',
      required: ['nome'],
      properties: {
        nome: { type: 'string' },
      },
    },

    response: {
      204: {
        description: 'Nome atualizado com sucesso',
        type: 'null',
      },
    },
  },
  }, atualizarNome)

  app.delete('/email/:id', {
  onRequest: [verificarJWT],
  schema: {
    tags: ['Emails'],
    summary: 'Deletar email',
    security: [{ bearerAuth: [] }],

    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },

    response: {
      204: {
        type: 'null',
        description: 'Email deletado com sucesso',
      },
    },
  },
  }, deletarEmail)

  app.post('/email', {
  onRequest: [verificarJWT],
  schema: {
    tags: ['Emails'],
    summary: 'Enviar email',
    description: 'Envia um email para um usuario cadastrado',
    security: [{ bearerAuth: [] }],

    body: {
      type: 'object',
      required: ['emailDoDestinatario', 'title', 'content'],
      properties: {
        emailDoDestinatario: {
          type: 'string',
          format: 'email',
        },
        title: { type: 'string' },
        content: { type: 'string' },
      },
    },

    response: {
      201: {
        description: 'Email enviado com sucesso',
      },
    },
  },
  }, enviarEmail)

  app.get('/sent-emails', {
  onRequest: [verificarJWT],
  schema: {
    tags: ['Emails'],
    summary: 'Listar emails enviados',
    description: 'Lista todos os emails enviados pelo usuario autenticado',
    security: [{ bearerAuth: [] }],

    response: {
      200: {
        type: 'object',
        properties: {
          emails: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                titulo: { type: 'string' },
                enviado_por: { type: 'string' },
                jaVisto: { type: 'boolean' },
                email_id: { type: 'string', format: 'uuid' },
              },
            },
          },
        },
      },
    },
  },
  }, listarEmailsEnviados)

  app.get('/email/:id', {
  onRequest: [verificarJWT],
  schema: {
    tags: ['Emails'],
    summary: 'Visualizar email',
    security: [{ bearerAuth: [] }],

    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },

    response: {
      200: {
        type: 'object',
        properties: {
          titulo: { type: 'string' },
          content: { type: 'string' },
          enviado_por: { type: 'string', format: 'uuid' },
        },
      },
    },
  },
  }, verEmail)

  app.get('/me', {
  onRequest: [verificarJWT],
  schema: {
    tags: ['Usuarios'],
    summary: 'Visualizar dados cadastrais',
    description: 'Retorna os dados do usuario autenticado',
    security: [{ bearerAuth: [] }],

    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string' },
          email: { type: 'string', format: 'email' },
          fotoDePerfil: {
            type: 'string',
            nullable: true,
          },
        },
      },
    },
  },
  }, verDadosCadastrais)
}
