import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { UsuarioJaExiste } from '../../errors/usuario-ja-existe.js'
import { buscarUsuarioPorEmail, criarUsuario } from '../../repositories/users.js'

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

  const usuarioExistente = await buscarUsuarioPorEmail(email)

  if (usuarioExistente) {
    throw new UsuarioJaExiste()
  }

  const senhaHash = await bcrypt.hash(senha, 6)

  await criarUsuario({
    nome,
    email,
    senha: senhaHash,
  })

  return reply.status(201).send()
}
