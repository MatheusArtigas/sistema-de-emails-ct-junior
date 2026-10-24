export class ErroDeAutenticacao extends Error {
    constructor() {
        super('Email ou senha incorretos.')
    }
}
