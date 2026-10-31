import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.js'
import { InMemoryEmailsRepository } from '../repositories/in-memory/in-memory-emails-repository.js'
import { EnviarEmailUseCase } from './enviar-email.js'
import { DestinatarioNaoEncontrado } from '../errors/erro-destinatario-nao-encontrado.js'

let usersRepository: InMemoryUsersRepository
let emailsRepository: InMemoryEmailsRepository
let enviarEmailUseCase: EnviarEmailUseCase

describe('Enviar Email Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    emailsRepository = new InMemoryEmailsRepository()

    enviarEmailUseCase = new EnviarEmailUseCase(
      usersRepository,
      emailsRepository
    )
  })

  it('deve ser possível enviar email para um destinatário que existe', async () => {
    const remetente = await usersRepository.criarUsuario({
      nome: 'Joao Grandao',
      email: 'joaograndao@gmail.com',
      senha: '603704',
    })

    const destinatario = await usersRepository.criarUsuario({
      nome: 'Maria',
      email: 'maria@gmail.com',
      senha: '123456',
    })

    await enviarEmailUseCase.execute({
      emailDoDestinatario: destinatario.email,
      title: 'Olá',
      content: 'Tudo bem?',
      userId: remetente.id,
    })

    expect(emailsRepository.emails).toEqual([
      expect.objectContaining({
        title: 'Olá',
        content: 'Tudo bem?',
        idDeQuemEnviou: remetente.id,
        idDeQuemRecebeu: destinatario.id,
      }),
    ])
  })

  it('não deve ser possível enviar email para um destinatário que não existe', async () => {
    const remetente = await usersRepository.criarUsuario({
      nome: 'Joao Grandao',
      email: 'joaograndao@gmail.com',
      senha: '603704',
    })

    await expect(
      enviarEmailUseCase.execute({
        emailDoDestinatario: 'inexistente@email.com',
        title: 'Olá',
        content: 'Tudo bem?',
        userId: remetente.id,
      })
    ).rejects.toBeInstanceOf(DestinatarioNaoEncontrado)

    expect(emailsRepository.emails).toEqual([])
  })

  it('deve ser possível enviar email para si mesmo', async () => {
    const usuario = await usersRepository.criarUsuario({
      nome: 'Joao Grandao',
      email: 'joaograndao@gmail.com',
      senha: '603704',
    })

    await enviarEmailUseCase.execute({
      emailDoDestinatario: usuario.email,
      title: 'Lembrete',
      content: 'Estudar TypeScript',
      userId: usuario.id,
    })

    expect(emailsRepository.emails).toEqual([
      expect.objectContaining({
        title: 'Lembrete',
        content: 'Estudar TypeScript',
        idDeQuemEnviou: usuario.id,
        idDeQuemRecebeu: usuario.id,
      }),
    ])
  })
})
