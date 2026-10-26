import { db } from '../../prisma/db.js'
import type { DadosDeCriacaoDeUsuario, UsersRepository } from '../users-repository.js'

export class PrismaUsersRepository implements UsersRepository {
  async buscarUsuarioPorEmail(email: string) {
    return db.orm.public.User.whereUnique({ email }).first()
  }

  async criarUsuario(dados: DadosDeCriacaoDeUsuario) {
    return db.orm.public.User.create(dados)
  }
}
