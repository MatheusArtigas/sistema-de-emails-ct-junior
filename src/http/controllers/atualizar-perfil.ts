import { randomUUID } from 'node:crypto'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileTypeFromBuffer } from 'file-type'
import { FormatoInvalido } from '../../errors/erro-formato-da-imagem.js'
import { TipoDeUploadInvalido } from '../../errors/erro-tipo-de-upload.js'
import { FotoNaoEnviada } from '../../errors/erro-foto-nao-enviada.js'
import { env } from '../../env/index.js'

import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { AtualizarFotoUseCase } from "../../use-cases/atualizar-foto";
import { AtualizarNomeUseCase } from "../../use-cases/atualizar-nome";

export async function atualizarFoto(
    request: FastifyRequest,
    reply: FastifyReply
) {
  if (!request.isMultipart()) {
    throw new TipoDeUploadInvalido()
  }

  let foto: Buffer | undefined

  for await (const parte of request.parts()) {
    if (parte.type === 'file') {
      const conteudo = await parte.toBuffer()
      
      if (parte.fieldname === 'foto') {
        foto = conteudo
      }
    }
  }

  if (!foto) {
    throw new FotoNaoEnviada()
  }

  const formato = await fileTypeFromBuffer(foto).catch(() => {
    throw new FormatoInvalido()
  })
  if (formato?.mime !== 'image/png' && formato?.mime !== 'image/jpeg') {
    throw new FormatoInvalido()
  }

  const caminhoFoto = `uploads/${randomUUID()}.${formato.ext}`
  const caminhoArquivo = resolve(caminhoFoto)
  await mkdir(resolve('uploads'), { recursive: true })
  await writeFile(caminhoArquivo, foto, { flag: 'wx' })

  const usersRepository = new PrismaUsersRepository()
  const atualizarFotoUseCase = new AtualizarFotoUseCase(usersRepository)

  try {
    await atualizarFotoUseCase.execute({
      caminhoFoto,
      userId: request.user.sub,
    })
  } catch (error) {
    await unlink(caminhoArquivo).catch((erroAoRemover) => {
      request.log.error(erroAoRemover, 'Falha ao remover a foto após erro na atualização.')
    })
    throw error
  }

  const url = `http://localhost:${env.PORT}/${caminhoFoto}`
  return reply.status(200).send({ url })
}

export async function atualizarNome(
    request: FastifyRequest,
    reply: FastifyReply
) {
  const esquemaNome = z.object({
    nome: z.string(),
  })

  const { nome } = esquemaNome.parse(request.body)

  const userId = request.user.sub

  const usersRepository = new PrismaUsersRepository()
  const atualizarNomeUseCase = new AtualizarNomeUseCase(usersRepository)
  
  await atualizarNomeUseCase.execute({
    nome: nome,
    userId
  })

  return reply.status(204).send()
}