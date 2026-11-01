import { randomUUID } from 'node:crypto'
import { Temporal } from 'temporal-polyfill'
import type { DadosDeCriacaoDeEmail, Email, EmailsRepository } from '../emails-repository.js'

export class InMemoryEmailsRepository implements EmailsRepository {
  public emails: Email[] = []

  async buscarEmailsRecebidos(idDoUsuario: string) {
    return this.emails.filter((email) => email.idDeQuemRecebeu === idDoUsuario)
  }

  async buscarEmailPorId(id: string) {
    return this.emails.find((email) => email.id === id) ?? null
  }

  async deletarEmail(id: string) {
    this.emails = this.emails.filter((email) => email.id !== id)
  }

  async criarEmail(dados: DadosDeCriacaoDeEmail) {
    const email: Email = {
      id: randomUUID(),
      title: dados.title,
      content: dados.content,
      idDeQuemEnviou: dados.idDeQuemEnviou,
      idDeQuemRecebeu: dados.idDeQuemRecebeu,
      data: Temporal.Now.instant(),
      jaVisto: false,
    }

    this.emails.push(email)

    return email
  }
    async buscarEmailsEnviados(idDoUsuario: string) {
      return this.emails.filter((email) => email.idDeQuemEnviou === idDoUsuario)
  }
}
