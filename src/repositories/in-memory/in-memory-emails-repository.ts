import type { Email, EmailsRepository } from '../emails-repository.js'

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
}
