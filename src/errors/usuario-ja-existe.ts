export class UsuarioJaExiste extends Error {
    constructor() {
        super('Email já cadastrado.')
    }
}
