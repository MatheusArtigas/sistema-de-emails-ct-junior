import type { FastifyRequest, FastifyReply } from 'fastify'

export async function verificarJWT(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await request.jwtVerify()
}