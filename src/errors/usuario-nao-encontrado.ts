export class UsuarioNaoEncontrado extends Error {
    constructor() {
        super('Usuário não encontrado.')
    }
}