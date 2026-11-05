import type { MultipartFile } from '@fastify/multipart'
import { fileTypeStream } from 'file-type'
import { Readable } from 'node:stream'
import { FormatoInvalido } from '../errors/erro-formato-da-imagem'

export async function validarImagem(arquivo: MultipartFile) {
  const formatosPermitidos = [
    'image/png',
    'image/jpeg'
  ]

  if (!formatosPermitidos.includes(arquivo.mimetype)) {
    arquivo.file.resume()
    throw new FormatoInvalido()
  }

  const webStream = Readable.toWeb(arquivo.file)

  const stream = await fileTypeStream(webStream)

  if (!stream.fileType || !formatosPermitidos.includes(stream.fileType.mime)) {
    await stream.cancel()
    throw new FormatoInvalido()
  }

  return stream
}
