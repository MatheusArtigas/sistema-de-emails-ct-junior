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

export interface EmailComRemetente extends Email {
  remetente: {
    nome: string
  }
}

export interface DadosDeCriacaoDeEmail {
  title: string
  content: string
  idDeQuemRecebeu: string
  idDeQuemEnviou: string
}

export interface EmailsRepository {
  buscarEmailsRecebidos(idDoUsuario: string): Promise<Email[]>
  buscarEmailPorId(id: string): Promise<EmailComRemetente | null>
  deletarEmail(id: string): Promise<void>
  criarEmail(dados: DadosDeCriacaoDeEmail): Promise<Email>
  buscarEmailsEnviados(idDoUsuario: string): Promise<Email[]>
  visualizarEmail(id: string): Promise<void>
}
