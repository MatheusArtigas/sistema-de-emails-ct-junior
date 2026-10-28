import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.js'
import { AtualizarFotoUseCase } from './atualizar-foto.js'

let usersRepository: InMemoryUsersRepository
let atualizarFotoUseCase: AtualizarFotoUseCase

describe('Atualizar foto de perfil', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    atualizarFotoUseCase = new AtualizarFotoUseCase(usersRepository)
  })

  it('deve ser possível atualizar a foto de perfil de um usuário', async () => {
    const usuario = await usersRepository.criarUsuario({
      nome: 'Joao Grandao',
      email: 'joaograndao@gmail.com',
      senha: '603704',
    })

    const foto = 'https://exemplo.com/foto.jpg'

    await atualizarFotoUseCase.execute({
      foto,
      userId: usuario.id,
    })

    expect(usuario.fotoDePerfil).toEqual(foto)
  })
})