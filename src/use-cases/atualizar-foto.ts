import { UsuarioNaoEncontrado } from "../errors/usuario-nao-encontrado"
import type { UsersRepository } from "../repositories/users-repository"

interface AtualizarFotoRequest {
  userId: string
  caminhoFoto: string
}

export class AtualizarFotoUseCase {
  constructor(private usersRepository: UsersRepository) {}

    async execute({ userId, caminhoFoto }: AtualizarFotoRequest) {
        const usuario = await this.usersRepository.atualizarFotoDePerfil(caminhoFoto, userId)

        if(!usuario) {
            throw new UsuarioNaoEncontrado()
        }

        return { usuario }
    }
}
