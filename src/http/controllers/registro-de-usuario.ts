import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository.js'
import { RegistroDeUsuarioUseCase } from '../../use-cases/registro-de-usuario.js'

export async function registroDeUsuarios(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const esquemaRegistro = z.object({
    nome: z.string(),
    email: z.email(),
    senha: z.string().min(6),
  })

  const { nome, email, senha } = esquemaRegistro.parse(request.body)

  const registroDeUsuarioUseCase = new RegistroDeUsuarioUseCase(new PrismaUsersRepository())
  await registroDeUsuarioUseCase.execute({ nome, email, senha })

  return reply.status(201).send()
}
