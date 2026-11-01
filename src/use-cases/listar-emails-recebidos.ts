import type { Email, EmailsRepository } from '../repositories/emails-repository.js'

interface ListarEmailsRecebidosRequest {
  userId: string
}

interface EmailRecebido extends Email {
  remetente?: {
    nome: string
  }
}

export class ListarEmailsRecebidosUseCase {
  constructor(private emailsRepository: EmailsRepository) {}

  async execute({ userId }: ListarEmailsRecebidosRequest) {
    const emails: EmailRecebido[] =
      await this.emailsRepository.buscarEmailsRecebidos(userId)

    return { emails }
  }
}
