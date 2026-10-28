import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { AtualizarFotoUseCase } from "../../use-cases/atualizar-foto";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";

export async function atualizarFoto(
    request: FastifyRequest,
    reply: FastifyReply
) {
  const esquemaFoto = z.object({
    foto: z.url(),
  })

  const { foto } = esquemaFoto.parse(request.body)

  const userId = request.user.sub

  const usersRepository = new PrismaUsersRepository()
  const atualizarFotoUseCase = new AtualizarFotoUseCase(usersRepository)

  await atualizarFotoUseCase.execute({
    foto: foto,
    userId,
  })

  return reply.status(204).send()
}