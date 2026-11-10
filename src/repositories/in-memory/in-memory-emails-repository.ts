import { randomUUID } from 'node:crypto'
import { Temporal } from 'temporal-polyfill'
import type { DadosDeCriacaoDeEmail, Email, EmailsRepository } from '../emails-repository.js'
import type { UsersRepository } from '../users-repository.js'

export class InMemoryEmailsRepository implements EmailsRepository {
  public emails: Email[] = []

  constructor(private usersRepository: UsersRepository) {}

  async buscarEmailsRecebidos(idDoUsuario: string) {
    return this.emails.filter((email) => email.idDeQuemRecebeu === idDoUsuario)
  }

  async buscarEmailPorId(id: string) {
    const email = this.emails.find((email) => email.id === id)

    if (!email) {
      return null
    }

    const remetente = await this.usersRepository.buscarUsuarioPorId(
      email.idDeQuemEnviou,
    )

    if (!remetente) {
      throw new Error('Remetente da mensagem não encontrado')
    }

    return {
      ...email,
      remetente: { nome: remetente.nome },
    }
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


  async visualizarEmail(id: string) {
    const email = this.emails.find((email) => email.id === id)

    if (email) {
      email.jaVisto = true
    }
  }
}
