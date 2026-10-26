import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository.js'
import { AutenticacaoUseCase } from '../../use-cases/autenticacao.js'

export async function autenticacao(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const esquemaAutenticacao = z.object({
    email: z.email(),
    senha: z.string(),
  })

  const { email, senha } = esquemaAutenticacao.parse(request.body)

  const repository = new PrismaUsersRepository()
  const autenticacaoUseCase = new AutenticacaoUseCase(repository)

  const { usuario } = await autenticacaoUseCase.execute({
    email,
    senha,
  })

  const token = await reply.jwtSign(
    { sub: usuario.id },
    { expiresIn: '2h' }
  )

  return reply.status(200).send({ token })
}
