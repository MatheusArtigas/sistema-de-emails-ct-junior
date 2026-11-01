
import { describe, it, expect, beforeEach } from 'vitest'
import { Temporal } from 'temporal-polyfill'
import { InMemoryEmailsRepository } from '../repositories/in-memory/in-memory-emails-repository.js'
import { EmailNaoEncontrado } from '../errors/erro-email-nao-encontrado.js'
import { NaoAutorizado } from '../errors/erro-nao-autorizado.js'
import { DeletarEmailUseCase } from './deletar-email.js'

let emailsRepository: InMemoryEmailsRepository
let deletarEmailUseCase: DeletarEmailUseCase

describe('Deletar email', () => {
  beforeEach(() => {
    emailsRepository = new InMemoryEmailsRepository()
    deletarEmailUseCase = new DeletarEmailUseCase(emailsRepository)

    emailsRepository.emails.push({
      id: 'email-1',
      title: 'Reunião',
      data: Temporal.Now.instant(),
      content: 'Reunião amanhã.',
      jaVisto: false,
      idDeQuemEnviou: 'usuario-1',
      idDeQuemRecebeu: 'usuario-2',
    })
  })

  it('deve ser possível deletar um email enviado que ainda não foi visto', async () => {
    await deletarEmailUseCase.execute({
      userId: 'usuario-1',
      emailId: 'email-1',
    })

    const email = await emailsRepository.buscarEmailPorId('email-1')

    expect(email).toBeNull()
  })

  it('não deve ser possível deletar um email inexistente', async () => {
    const resultado = deletarEmailUseCase.execute({
      userId: 'usuario-1',
      emailId: 'email-inexistente',
    })

    await expect(resultado).rejects.toBeInstanceOf(EmailNaoEncontrado)
  })

  it('não deve ser possível deletar um email que já foi visto', async () => {
    const email = await emailsRepository.buscarEmailPorId('email-1')

    if (email) {
      email.jaVisto = true
    }

    const resultado = deletarEmailUseCase.execute({
      userId: 'usuario-1',
      emailId: 'email-1',
    })

    await expect(resultado).rejects.toBeInstanceOf(NaoAutorizado)

    const emailDepois = await emailsRepository.buscarEmailPorId('email-1')

    expect(emailDepois).not.toBeNull()
    expect(emailDepois?.jaVisto).toEqual(true)
  })

  it('não deve ser possível deletar um email enviado por outro usuário', async () => {
    const resultado = deletarEmailUseCase.execute({
      userId: 'usuario-2',
      emailId: 'email-1',
    })

    await expect(resultado).rejects.toBeInstanceOf(NaoAutorizado)

    const emailDepois = await emailsRepository.buscarEmailPorId('email-1')

    expect(emailDepois).not.toBeNull()
  })
})
