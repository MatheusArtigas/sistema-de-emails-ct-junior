export class FotoNaoEnviada extends Error {
    constructor() {
        super('Envie um arquivo no campo foto.')
    }
}
