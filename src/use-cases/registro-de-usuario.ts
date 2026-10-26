import bcrypt from 'bcrypt'
import { UsuarioJaExiste } from '../errors/usuario-ja-existe.js'
import type { DadosDeCriacaoDeUsuario, UsersRepository } from '../repositories/users-repository.js'

export class RegistroDeUsuarioUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ nome, email, senha }: DadosDeCriacaoDeUsuario) {
    const usuarioExistente = await this.usersRepository.buscarUsuarioPorEmail(email)

    if (usuarioExistente) {
      throw new UsuarioJaExiste()
    }

    const senhaHash = await bcrypt.hash(senha, 6)
    const usuario = await this.usersRepository.criarUsuario({ nome, email, senha: senhaHash })

    return { usuario }
  }
}
