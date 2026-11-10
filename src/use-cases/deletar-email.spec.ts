
import { describe, it, expect, beforeEach } from 'vitest'
import { Temporal } from 'temporal-polyfill'
import { InMemoryEmailsRepository } from '../repositories/in-memory/in-memory-emails-repository.js'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.js'
import { EmailNaoEncontrado } from '../errors/erro-email-nao-encontrado.js'
import { NaoAutorizado } from '../errors/erro-nao-autorizado.js'
import { DeletarEmailUseCase } from './deletar-email.js'

let remetenteId: string
let emailsRepository: InMemoryEmailsRepository
let deletarEmailUseCase: DeletarEmailUseCase

describe('Deletar email', () => {
  beforeEach(async () => {
    const usersRepository = new InMemoryUsersRepository()
    emailsRepository = new InMemoryEmailsRepository(usersRepository)

    const remetente = await usersRepository.criarUsuario({
      nome: 'Remetente',
      email: 'remetente@example.com',
      senha: '123456',
    })
    remetenteId = remetente.id
    deletarEmailUseCase = new DeletarEmailUseCase(emailsRepository)

    emailsRepository.emails.push({
      id: 'email-1',
      title: 'Reunião',
      data: Temporal.Now.instant(),
      content: 'Reunião amanhã.',
      jaVisto: false,
      idDeQuemEnviou: remetenteId,
      idDeQuemRecebeu: 'usuario-2',
    })
  })

  it('deve ser possível deletar um email enviado que ainda não foi visto', async () => {
    await deletarEmailUseCase.execute({
      userId: remetenteId,
      emailId: 'email-1',
    })

    const email = await emailsRepository.buscarEmailPorId('email-1')

    expect(email).toBeNull()
  })

  it('não deve ser possível deletar um email inexistente', async () => {
    const resultado = deletarEmailUseCase.execute({
      userId: remetenteId,
      emailId: 'email-inexistente',
    })

    await expect(resultado).rejects.toBeInstanceOf(EmailNaoEncontrado)
  })

  it('não deve ser possível deletar um email que já foi visto', async () => {
    await emailsRepository.visualizarEmail('email-1')

    const resultado = deletarEmailUseCase.execute({
      userId: remetenteId,
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
