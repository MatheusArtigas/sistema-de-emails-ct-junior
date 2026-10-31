import { DestinatarioNaoEncontrado } from "../errors/erro-destinatario-nao-encontrado"
import type { EmailsRepository } from "../repositories/emails-repository"
import type { UsersRepository } from "../repositories/users-repository"

interface EnviarEmailRequest {
  emailDoDestinatario: string
  title: string
  content: string
  userId: string
}

export class EnviarEmailUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private emailsRepository: EmailsRepository
  ) {}

  async execute({
    emailDoDestinatario,
    title,
    content,
    userId,
  }: EnviarEmailRequest) {
    const destinatario =
      await this.usersRepository.buscarUsuarioPorEmail(emailDoDestinatario)

    if (!destinatario) {
      throw new DestinatarioNaoEncontrado()
    }

    await this.emailsRepository.criarEmail({
      title,
      content,
      idDeQuemRecebeu: destinatario.id,
      idDeQuemEnviou: userId,
    })
  }
}