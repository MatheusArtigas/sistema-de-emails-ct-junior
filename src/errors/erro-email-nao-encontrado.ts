export class EmailNaoEncontrado extends Error {
    constructor() {
        super('e-mail não encontrado.')
    }
}