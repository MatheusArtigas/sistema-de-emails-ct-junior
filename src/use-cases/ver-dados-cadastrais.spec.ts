import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { VerDadosCadastraisUseCase } from './ver-dados-cadastrais'
import { UsuarioNaoEncontrado } from '../errors/usuario-nao-encontrado'

let usersRepository: InMemoryUsersRepository
let verDadosCadastraisUseCase: VerDadosCadastraisUseCase

describe('Ver dados cadastrais', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    verDadosCadastraisUseCase = new VerDadosCadastraisUseCase(usersRepository)
  })

  it('deve ser possível visualizar os dados cadastrais de um usuário', async () => {
    const usuario = await usersRepository.criarUsuario({
      nome: 'Joao Grandao',
      email: 'joaograndao@gmail.com',
      senha: '603704',
    })

    const { dados } = await verDadosCadastraisUseCase.execute({
      userId: usuario.id,
    })

    expect(dados.id).toEqual(usuario.id)
    expect(dados.nome).toEqual('Joao Grandao')
    expect(dados.email).toEqual('joaograndao@gmail.com')
    expect(dados.fotoDePerfil).toEqual(null)
  })

  it('não deve ser possível visualizar dados de um usuário inexistente', async () => {
    await expect(() =>
      verDadosCadastraisUseCase.execute({
        userId: 'usuario-inexistente',
      })
    ).rejects.toBeInstanceOf(UsuarioNaoEncontrado)
  })
})
