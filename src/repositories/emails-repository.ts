import type { Temporal } from 'temporal-polyfill'

export interface Email {
  id: string
  title: string
  data: Temporal.Instant
  content: string
  jaVisto: boolean
  idDeQuemEnviou: string
  idDeQuemRecebeu: string
}

export interface EmailsRepository {
  buscarEmailsRecebidos(idDoUsuario: string): Promise<Email[]>
  buscarEmailPorId(id: string): Promise<Email | null>
  deletarEmail(id: string): Promise<void>
}
