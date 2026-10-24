import { db } from '../prisma/db.js'

export async function buscarEmailsRecebidos(idDoUsuario: string) {
  return db.orm.public.Email
    .where((email) =>
      email.idDeQuemRecebeu.eq(idDoUsuario)
    )
    .orderBy((email) => email.data.desc())
    .include('remetente')
    .all()
}