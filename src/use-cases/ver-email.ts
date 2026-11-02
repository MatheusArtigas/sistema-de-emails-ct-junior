import { EmailNaoEncontrado } from '../errors/erro-email-nao-encontrado'
import { NaoAutorizado } from '../errors/erro-nao-autorizado'
import type { EmailsRepository } from '../repositories/emails-repository'

interface VerEmailRequest {
  userId: string
  emailId: string
}

export class VerEmailUseCase {
  constructor(private emailsRepository: EmailsRepository) {}

  async execute({ userId, emailId }: VerEmailRequest) {
    const email = await this.emailsRepository.buscarEmailPorId(emailId)

    if (!email) {
      throw new EmailNaoEncontrado()
    }

    if (userId !== email.idDeQuemRecebeu && userId !== email.idDeQuemEnviou) {
      throw new NaoAutorizado()
    }

    if (userId === email.idDeQuemRecebeu) {
      await this.emailsRepository.visualizarEmail(emailId)
    }

    return { email }
  }
}
