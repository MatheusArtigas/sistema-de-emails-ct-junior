import { UsuarioNaoEncontrado } from '../errors/usuario-nao-encontrado'
import type { UsersRepository } from '../repositories/users-repository'

interface VerDadosCadastraisRequest {
  userId: string
}

export class VerDadosCadastraisUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: VerDadosCadastraisRequest) {
    const dados = await this.usersRepository.buscarUsuarioPorId(userId)

    if (!dados) {
      throw new UsuarioNaoEncontrado()
    }

    return { dados }
  }
}
