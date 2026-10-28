import { UsuarioNaoEncontrado } from "../errors/usuario-nao-encontrado"
import type { UsersRepository } from "../repositories/users-repository"

interface AtualizarFotoRequest {
  userId: string
  foto: string
}

export class AtualizarFotoUseCase {
  constructor(private usersRepository: UsersRepository) {}

    async execute({ userId, foto }: AtualizarFotoRequest) {
        const usuario = await this.usersRepository.atualizarFotoDePerfil(foto, userId)

        if(!usuario) {
            throw new UsuarioNaoEncontrado()
        }

        return { usuario }
    }
}
