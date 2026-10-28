import type { FastifyRequest } from 'fastify'

export async function verificarJWT(
  request: FastifyRequest
) {
  await request.jwtVerify()
}