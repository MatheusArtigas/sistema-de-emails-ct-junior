export class DestinatarioNaoEncontrado extends Error {
    constructor() {
        super('Destinatário não encontrado.')
    }
}