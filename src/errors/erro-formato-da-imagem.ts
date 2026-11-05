export class FormatoInvalido extends Error {
    constructor() {
        super('Formato inválido. Use PNG, JPG ou JPEG.')
    }
}
