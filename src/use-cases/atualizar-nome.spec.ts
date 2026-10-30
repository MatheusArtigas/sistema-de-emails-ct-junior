import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.js'
import { AtualizarNomeUseCase } from './atualizar-nome.js'

let usersRepository: InMemoryUsersRepository
let atualizarNomeUseCase: AtualizarNomeUseCase

describe('Atualizar nome de usuário', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    atualizarNomeUseCase = new AtualizarNomeUseCase(usersRepository)
  })

  it('deve ser possível atualizar o nome de um usuário', async () => {
    const usuario = await usersRepository.criarUsuario({
      nome: 'Joao Grandao',
      email: 'joaograndao@gmail.com',
      senha: '603704',
    })

    const novoNome = 'Joao Pequeno'

    await atualizarNomeUseCase.execute({
      nome: novoNome,
      userId: usuario.id,
    })

    expect(usuario.nome).toEqual(novoNome)
  })
})