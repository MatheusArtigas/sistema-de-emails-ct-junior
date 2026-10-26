import type { FastifyRequest, FastifyReply } from 'fastify'
import { buscarEmailsRecebidos } from '../../repositories/emails.js'

export async function meusEmails(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const idDoUsuario = request.user.sub

  const emails = await buscarEmailsRecebidos(idDoUsuario)

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
