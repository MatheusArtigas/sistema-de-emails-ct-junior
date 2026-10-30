import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'
import { PrismaEmailsRepository } from '../../repositories/prisma/prisma-emails-repository'
import { DeletarEmailUseCase } from '../../use-cases/deletar-email'

export async function meusEmails(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const idDoUsuario = request.user.sub

  const emailsRepository = new PrismaEmailsRepository()

  const emails = await emailsRepository.buscarEmailsRecebidos(idDoUsuario)

  const resultado = emails.map((email) => ({
    titulo: email.title,
    enviado_por: email.remetente.nome,
    jaVisto: email.jaVisto,
    email_id: email.id,
  }))

  return reply.status(200).send({
    emails: resultado,
  })
}

export async function deletarEmail(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const esquemaDeletarEmail = z.object({
    id: z.uuid(),
  })

  const { id } = esquemaDeletarEmail.parse(request.params)

  const userId = request.user.sub

  const emailsRepository = new PrismaEmailsRepository()
  const deletarEmailUseCase = new DeletarEmailUseCase(emailsRepository)

  await deletarEmailUseCase.execute({
    emailId: id,
    userId,
  })

  return reply.status(204).send()
}