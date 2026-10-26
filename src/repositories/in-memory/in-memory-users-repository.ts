import { randomUUID } from 'node:crypto'
import type { DadosDeCriacaoDeUsuario, Usuario, UsersRepository } from '../users-repository.js'

export class InMemoryUsersRepository implements UsersRepository {
  public usuarios: Usuario[] = []

  async buscarUsuarioPorEmail(email: string) {
    return this.usuarios.find((usuario) => usuario.email === email) ?? null
  }

  async criarUsuario(dados: DadosDeCriacaoDeUsuario) {
    const usuario: Usuario = { ...dados, id: randomUUID(), fotoDePerfil: null }
    this.usuarios.push(usuario)
    return usuario
  }
}
