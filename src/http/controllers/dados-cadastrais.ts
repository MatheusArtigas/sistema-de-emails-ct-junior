import type { FastifyReply, FastifyRequest } from "fastify"
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository"
import { VerDadosCadastraisUseCase } from "../../use-cases/ver-dados-cadastrais"

export async function verDadosCadastrais(
    request: FastifyRequest,
    reply: FastifyReply
) {
  const userId = request.user.sub

  const usersRepository = new PrismaUsersRepository()
  const verDadosCadastraisUseCase = new VerDadosCadastraisUseCase(usersRepository)

  const { dados } = await verDadosCadastraisUseCase.execute({
    userId,
  })

  return reply.status(200).send({
    id: dados.id,
    nome: dados.nome,
    email: dados.email,
    fotoDePerfil: dados.fotoDePerfil,
  })
}