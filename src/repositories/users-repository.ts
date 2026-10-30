export interface Usuario {
  id: string
  nome: string
  email: string
  senha: string
  fotoDePerfil: string | null
}

export interface DadosDeCriacaoDeUsuario {
  nome: string
  email: string
  senha: string
}

export interface UsersRepository {
  buscarUsuarioPorEmail(email: string): Promise<Usuario | null>
  criarUsuario(dados: DadosDeCriacaoDeUsuario): Promise<Usuario>
  atualizarFotoDePerfil(foto: string, userId: string): Promise<Usuario | null>
  atualizarNomeDeUsuario(nome: string, userId: string): Promise<Usuario | null>
}

