import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'
import { PrismaEmailsRepository } from '../../repositories/prisma/prisma-emails-repository'
import { DestinatarioNaoEncontrado } from '../../errors/erro-destinatario-nao-encontrado'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { EnviarEmailUseCase } from '../../use-cases/enviar-email'

export async function enviarEmail(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const esquemaEnviarEmail = z.object({
    emailDoDestinatario: z.email(),
    title: z.string(),
    content: z.string(),
  })

  const { emailDoDestinatario, title, content } = esquemaEnviarEmail.parse(request.body)

  const userId = request.user.sub

  const usersRepository = new PrismaUsersRepository()
  const emailsRepository = new PrismaEmailsRepository()

  const enviarEmailUseCase = new EnviarEmailUseCase(
    usersRepository,
    emailsRepository
  )

  await enviarEmailUseCase.execute({
    emailDoDestinatario,
    title,
    content,
    userId,
    })

  return reply.status(201).send()
}
