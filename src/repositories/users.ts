import { db } from '../prisma/db.js'

export async function buscarUsuarioPorEmail(email: string) {
  return db.orm.public.User
    .whereUnique({ email })
    .first()
}

export async function criarUsuario(dados: {
  nome: string
  email: string
  senha: string
}) {
  return db.orm.public.User.create(dados)
}