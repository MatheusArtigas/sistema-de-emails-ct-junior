import { UsuarioNaoEncontrado } from "../errors/usuario-nao-encontrado"
import type { UsersRepository } from "../repositories/users-repository"

interface AtualizarNomeRequest {
  userId: string
  nome: string
}

export class AtualizarNomeUseCase {
  constructor(private usersRepository: UsersRepository) {}

    async execute({ userId, nome }: AtualizarNomeRequest) {
        const usuario = await this.usersRepository.atualizarNomeDeUsuario(nome, userId)

        if(!usuario) {
            throw new UsuarioNaoEncontrado()
        }

        return { usuario }
    }
}