import bcrypt from 'bcrypt'
import { ErroDeAutenticacao } from '../errors/erro-de-autenticacao.js'
import type { UsersRepository } from '../repositories/users-repository.js'

export class AutenticacaoUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, senha }: { email: string; senha: string }) {
    const usuario = await this.usersRepository.buscarUsuarioPorEmail(email)

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      throw new ErroDeAutenticacao()
    }

    return { usuario }
  }
}
