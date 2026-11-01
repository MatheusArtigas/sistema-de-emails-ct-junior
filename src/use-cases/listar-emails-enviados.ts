import type { Email, EmailsRepository } from '../repositories/emails-repository.js'

interface ListarEmailsEnviadosRequest {
  userId: string
}

interface EmailEnviado extends Email {
  destinatario?: {
    nome: string
  }
}

export class ListarEmailsEnviadosUseCase {
  constructor(private emailsRepository: EmailsRepository) {}

  async execute({ userId }: ListarEmailsEnviadosRequest) {
    const emails: EmailEnviado[] =
      await this.emailsRepository.buscarEmailsEnviados(userId)

    return { emails }
  }
}
