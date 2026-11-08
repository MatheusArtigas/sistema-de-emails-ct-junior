export class TipoDeUploadInvalido extends Error {
    constructor() {
        super('Envie a foto em multipart/form-data.')
    }
}
