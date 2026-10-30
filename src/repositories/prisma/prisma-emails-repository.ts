import { db } from '../../prisma/db.js'
import type { EmailsRepository } from '../emails-repository.js'

export class PrismaEmailsRepository implements EmailsRepository {
    async buscarEmailsRecebidos(idDoUsuario: string) {
        return db.orm.public.Email
            .where((email) => email.idDeQuemRecebeu.eq(idDoUsuario))
            .orderBy((email) => email.data.desc())
            .include('remetente')
            .all()

    }

    async buscarEmailPorId(id: string) {
        const email = await db.orm.public.Email
            .whereUnique({ id })
            .first()
        
        return email
    }

    async deletarEmail(id: string) {
        await db.orm.public.Email
            .whereUnique({ id })
            .delete()
    }
}
