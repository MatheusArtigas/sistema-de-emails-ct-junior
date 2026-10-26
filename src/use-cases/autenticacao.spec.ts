import { expect, describe, it, beforeEach } from 'vitest'
import bcrypt from 'bcrypt'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.js'
import { AutenticacaoUseCase } from './autenticacao.js'
import { ErroDeAutenticacao } from '../errors/erro-de-autenticacao.js'

let repository: InMemoryUsersRepository
let autenticacaoUseCase: AutenticacaoUseCase

describe('Autenticacao Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    autenticacaoUseCase = new AutenticacaoUseCase(repository)
  })

  it('Deve autenticar um usuário com credenciais corretas', async () => {
    const email = 'joaograndao@gmail.com'
    const senha = '603704'
    const senhaHash = await bcrypt.hash(senha, 6)

    await repository.criarUsuario({
      nome: 'Joao Grandao',
      email,
      senha: senhaHash,
    })

    const { usuario } = await autenticacaoUseCase.execute({
      email,
      senha,
    })

    expect(usuario.email).toEqual(email)
  })

  it('Não deve autenticar um usuário inexistente', async () => {
    await expect(
      autenticacaoUseCase.execute({
        email: 'inexistente@gmail.com',
        senha: '123456',
      })
    ).rejects.toBeInstanceOf(ErroDeAutenticacao)
  })

  it('Não deve autenticar um usuário com senha incorreta', async () => {
    const email = 'joaograndao@gmail.com'
    const senha = '603704'
    const senhaHash = await bcrypt.hash(senha, 6)

    await repository.criarUsuario({
      nome: 'Joao Grandao',
      email,
      senha: senhaHash,
    })

    await expect(
        autenticacaoUseCase.execute({
            email,
            senha: '123456',
        })
    ).rejects.toBeInstanceOf(ErroDeAutenticacao)
  })
})