import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryEmailsRepository } from '../repositories/in-memory/in-memory-emails-repository.js'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.js'
import { ListarEmailsRecebidosUseCase } from './listar-emails-recebidos.js'

let emailsRepository: InMemoryEmailsRepository
let listarEmailsRecebidosUseCase: ListarEmailsRecebidosUseCase

describe('Listar emails recebidos', () => {
  beforeEach(() => {
    const usersRepository = new InMemoryUsersRepository()
    emailsRepository = new InMemoryEmailsRepository(usersRepository)
    listarEmailsRecebidosUseCase = new ListarEmailsRecebidosUseCase(emailsRepository)
  })

  it('deve ser possível listar os emails recebidos por um usuário', async () => {
    const primeiroEmail = await emailsRepository.criarEmail({
      title: 'Reunião',
      content: 'Reunião amanhã.',
      idDeQuemEnviou: 'usuario-1',
      idDeQuemRecebeu: 'usuario-2',
    })

    const segundoEmail = await emailsRepository.criarEmail({
      title: 'Lembrete',
      content: 'Estudar TypeScript',
      idDeQuemEnviou: 'usuario-3',
      idDeQuemRecebeu: 'usuario-2',
    })

    const { emails } = await listarEmailsRecebidosUseCase.execute({
      userId: 'usuario-2',
    })

    expect(emails).toEqual([primeiroEmail, segundoEmail])
  })

  it('não deve listar emails recebidos por outro usuário', async () => {
    const emailRecebido = await emailsRepository.criarEmail({
      title: 'Reunião',
      content: 'Reunião amanhã.',
      idDeQuemEnviou: 'usuario-1',
      idDeQuemRecebeu: 'usuario-2',
    })

    await emailsRepository.criarEmail({
      title: 'Resposta',
      content: 'Reunião confirmada.',
      idDeQuemEnviou: 'usuario-2',
      idDeQuemRecebeu: 'usuario-1',
    })

    const { emails } = await listarEmailsRecebidosUseCase.execute({
      userId: 'usuario-2',
    })

    expect(emails).toEqual([emailRecebido])
  })
})
