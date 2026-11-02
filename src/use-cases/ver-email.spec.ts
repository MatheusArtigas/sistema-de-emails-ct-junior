import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryEmailsRepository } from '../repositories/in-memory/in-memory-emails-repository'
import { VerEmailUseCase } from './ver-email'
import { EmailNaoEncontrado } from '../errors/erro-email-nao-encontrado'
import { NaoAutorizado } from '../errors/erro-nao-autorizado'

let emailsRepository: InMemoryEmailsRepository
let verEmailUseCase: VerEmailUseCase

describe('Visualizar email', () => {
  beforeEach(() => {
    emailsRepository = new InMemoryEmailsRepository()
    verEmailUseCase = new VerEmailUseCase(emailsRepository)
  })

  it('deve ser possível visualizar um email recebido', async () => {
    const email = await emailsRepository.criarEmail({
      title: 'Email de teste',
      content: 'Conteudo do email',
      idDeQuemEnviou: 'usuario-1',
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
      idDeQuemEnviou: 'usuario-1',
      idDeQuemRecebeu: 'usuario-2',
    })

    const resultado = await verEmailUseCase.execute({
      userId: 'usuario-1',
      emailId: email.id,
    })

    expect(resultado.email.id).toEqual(email.id)
    expect(emailsRepository.emails[0]!.jaVisto).toEqual(false)
  })

  it('não deve ser possível visualizar email de outro usuário', async () => {
    const email = await emailsRepository.criarEmail({
      title: 'Email privado',
      content: 'Conteudo privado',
      idDeQuemEnviou: 'usuario-1',
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
        userId: 'usuario-1',
        emailId: 'email-inexistente',
      })
    ).rejects.toBeInstanceOf(EmailNaoEncontrado)
  })
})
