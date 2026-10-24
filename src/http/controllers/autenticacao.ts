import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { ErroDeAutenticacao } from '../../errors/erro-de-autenticacao.js'
import { buscarUsuarioPorEmail } from '../../repositories/users.js'

export async function autenticacao(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const esquemaAutenticacao = z.object({
    email: z.email(),
    senha: z.string(),
  })

  const { email, senha } = esquemaAutenticacao.parse(request.body)
  const usuario = await buscarUsuarioPorEmail(email)

  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    throw new ErroDeAutenticacao()
  }

  const token = await reply.jwtSign({ 
    sub: usuario.id },
    { expiresIn: '2h'}
  )

  return reply.status(200).send({ token })
}
