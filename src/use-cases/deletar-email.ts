import { EmailNaoEncontrado } from '../errors/erro-email-nao-encontrado.js'
import { NaoAutorizado } from '../errors/erro-nao-autorizado.js'
import type { EmailsRepository } from '../repositories/emails-repository.js'

interface DeletarEmailRequest {
  userId: string
  emailId: string
}

export class DeletarEmailUseCase {
  constructor(private emailsRepository: EmailsRepository) {}

  async execute({ userId, emailId }: DeletarEmailRequest) {
    const email = await this.emailsRepository.buscarEmailPorId(emailId)

    if (!email) {
      throw new EmailNaoEncontrado()
    }

    if (email.jaVisto || email.idDeQuemEnviou !== userId) {
      throw new NaoAutorizado()
    }

    await this.emailsRepository.deletarEmail(emailId)
  }
}
