import type { FastifyReply, FastifyRequest } from "fastify"
import { PrismaEmailsRepository } from "../../repositories/prisma/prisma-emails-repository"
import { ListarEmailsEnviadosUseCase } from "../../use-cases/listar-emails-enviados"

export async function listarEmailsEnviados(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user.sub

  const emailsRepository = new PrismaEmailsRepository()

  const listarEmailsEnviadosUseCase = new ListarEmailsEnviadosUseCase(emailsRepository)

  const { emails } = await listarEmailsEnviadosUseCase.execute({
    userId,
  })

  const resultado = emails.map((email) => ({
    titulo: email.title,
    destinatario: email.destinatario?.nome,
    jaVisto: email.jaVisto,
    email_id: email.id,
  }))

  return reply.status(200).send({
    emails: resultado,
  })
}