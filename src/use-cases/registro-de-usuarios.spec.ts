import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.js'
import { RegistroDeUsuarioUseCase } from './registro-de-usuario.js'
import { UsuarioJaExiste } from '../errors/usuario-ja-existe.js'
import bcrypt from 'bcrypt'

let repository: InMemoryUsersRepository
let registroUseCase: RegistroDeUsuarioUseCase

describe('Registro de usuários', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    registroUseCase = new RegistroDeUsuarioUseCase(repository)
  })

  it('Deve registrar um usuário corretamente', async () => {
    const nome = 'Joao Grandao'
    const email = 'joaograndao@gmail.com'
    const senha = '603704'

    await registroUseCase.execute({
        nome,
        email,
        senha,
    })

    const usuario = await repository.buscarUsuarioPorEmail(email)

    expect(usuario).not.toBeNull()
    expect(usuario?.nome).toEqual(nome)
    expect(usuario?.email).toEqual(email)
  })

  it('Não deve registrar um email duplicado', async () => {
    const nome = 'Joao Grandao'
    const email = 'joaograndao@gmail.com'
    const senha = '603704'

    await repository.criarUsuario({
      nome,
      email,
      senha,
    })

    await expect(
        registroUseCase.execute({
      nome: 'Matheus',
      email,
      senha: '123456',
    })
    ).rejects.toBeInstanceOf(UsuarioJaExiste)
  })

  it('Deve armazenar a senha como hash', async () => {
    const nome = 'Joao Grandao'
    const email = 'joaograndao@gmail.com'
    const senha = '603704'

    await registroUseCase.execute({
      nome,
      email,
      senha,
    })

    const usuario = await repository.buscarUsuarioPorEmail(email)

    expect(usuario?.senha).not.toEqual(senha)

    if (!usuario) {
        throw new Error('Usuário não encontrado')
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

    expect(senhaCorreta).toBe(true)
  })

  it('Deve gerar um ID para o usuário', async () => {
    const email = 'joaograndao@gmail.com'

    await registroUseCase.execute({
        nome: 'Joao Grandao',
        email,
        senha: '603704',
    })

    const usuario = await repository.buscarUsuarioPorEmail(email)

    expect(usuario?.id).toEqual(expect.any(String))
    expect(usuario?.id).not.toBe('')
  })
})