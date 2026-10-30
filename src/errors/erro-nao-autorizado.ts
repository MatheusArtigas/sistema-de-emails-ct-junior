export class NaoAutorizado extends Error {
    constructor() {
        super('Não autorizado.')
    }
}
