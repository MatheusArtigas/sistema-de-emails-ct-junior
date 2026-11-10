import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryEmailsRepository } from '../repositories/in-memory/in-memory-emails-repository.js'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.js'
import { ListarEmailsEnviadosUseCase } from './listar-emails-enviados.js'

let emailsRepository: InMemoryEmailsRepository
let listarEmailsEnviadosUseCase: ListarEmailsEnviadosUseCase

describe('Listar emails enviados', () => {
  beforeEach(() => {
    const usersRepository = new InMemoryUsersRepository()
    emailsRepository = new InMemoryEmailsRepository(usersRepository)
    listarEmailsEnviadosUseCase = new ListarEmailsEnviadosUseCase(emailsRepository)
  })

  it('deve ser possível listar os emails enviados por um usuário', async () => {
    const primeiroEmail = await emailsRepository.criarEmail({
      title: 'Reunião',
      content: 'Reunião amanhã.',
      idDeQuemEnviou: 'usuario-1',
      idDeQuemRecebeu: 'usuario-2',
    })

    const segundoEmail = await emailsRepository.criarEmail({
      title: 'Lembrete',
      content: 'Estudar TypeScript',
      idDeQuemEnviou: 'usuario-1',
      idDeQuemRecebeu: 'usuario-3',
    })

    const { emails } = await listarEmailsEnviadosUseCase.execute({
      userId: 'usuario-1',
    })

    expect(emails).toEqual([primeiroEmail, segundoEmail])
  })

  it('não deve listar emails enviados por outro usuário', async () => {
    const primeiroEmail = await emailsRepository.criarEmail({
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

    const { emails } = await listarEmailsEnviadosUseCase.execute({
      userId: 'usuario-1',
    })

    expect(emails).toEqual([primeiroEmail])
  })
})
