import { db } from '../../prisma/db.js'
import type { DadosDeCriacaoDeUsuario, UsersRepository } from '../users-repository.js'

export class PrismaUsersRepository implements UsersRepository {
  async buscarUsuarioPorEmail(email: string) {
    return db.orm.public.User
      .whereUnique({ email })
      .first()
  }

  async criarUsuario(dados: DadosDeCriacaoDeUsuario) {
    return db.orm.public.User.create(dados)
  }

  async atualizarFotoDePerfil(foto: string, userId: string) {
    return db.orm.public.User
      .where({ id: userId })
      .update({ fotoDePerfil: foto })
  }

  async atualizarNomeDeUsuario(nomeNovo: string, userId: string) {
    return db.orm.public.User
      .where({ id: userId })
      .update({ nome: nomeNovo})
  }
}
