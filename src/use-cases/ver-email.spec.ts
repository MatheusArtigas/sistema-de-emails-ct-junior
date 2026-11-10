import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryEmailsRepository } from '../repositories/in-memory/in-memory-emails-repository'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { VerEmailUseCase } from './ver-email'
import { EmailNaoEncontrado } from '../errors/erro-email-nao-encontrado'
import { NaoAutorizado } from '../errors/erro-nao-autorizado'

let remetenteId: string
let emailsRepository: InMemoryEmailsRepository
let verEmailUseCase: VerEmailUseCase

describe('Visualizar email', () => {
  beforeEach(async () => {
    const usersRepository = new InMemoryUsersRepository()
    emailsRepository = new InMemoryEmailsRepository(usersRepository)

    const remetente = await usersRepository.criarUsuario({
      nome: 'Remetente',
      email: 'remetente@example.com',
      senha: '123456',
    })
    remetenteId = remetente.id
    verEmailUseCase = new VerEmailUseCase(emailsRepository)
  })

  it('deve ser possível visualizar um email recebido', async () => {
    const email = await emailsRepository.criarEmail({
      title: 'Email de teste',
      content: 'Conteudo do email',
      idDeQuemEnviou: remetenteId,
      idDeQuemRecebeu: 'usuario-2',
    })

    const resultado = await verEmailUseCase.execute({
      userId: 'usuario-2',
      emailId: email.id,
    })

    expect(resultado.email.id).toEqual(email.id)
    expect(resultado.email.title).toEqual('Email de teste')
    expect(emailsRepository.emails[0]!.jaVisto).toEqual(true)
  })

  it('deve ser possível visualizar um email enviado', async () => {
    const email = await emailsRepository.criarEmail({
      title: 'Email enviado',
      content: 'Conteudo do email',
      idDeQuemEnviou: remetenteId,
      idDeQuemRecebeu: 'usuario-2',
    })

    const resultado = await verEmailUseCase.execute({
      userId: remetenteId,
      emailId: email.id,
    })

    expect(resultado.email.id).toEqual(email.id)
    expect(emailsRepository.emails[0]!.jaVisto).toEqual(false)
  })

  it('não deve ser possível visualizar email de outro usuário', async () => {
    const email = await emailsRepository.criarEmail({
      title: 'Email privado',
      content: 'Conteudo privado',
      idDeQuemEnviou: remetenteId,
      idDeQuemRecebeu: 'usuario-2',
    })

    await expect(() =>
      verEmailUseCase.execute({
        userId: 'usuario-3',
        emailId: email.id,
      })
    ).rejects.toBeInstanceOf(NaoAutorizado)

    expect(emailsRepository.emails[0]!.jaVisto).toEqual(false)
  })

  it('não deve ser possível visualizar um email inexistente', async () => {
    await expect(() =>
      verEmailUseCase.execute({
        userId: remetenteId,
        emailId: 'email-inexistente',
      })
    ).rejects.toBeInstanceOf(EmailNaoEncontrado)
  })
})
