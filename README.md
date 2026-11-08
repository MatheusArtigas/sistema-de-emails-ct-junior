# Sistema de Emails

## Upload da foto de perfil

Incie o docker para subir o database e inicie o server com `npm run dev`.

1. Abra o [Swagger local](http://localhost:3333/docs) e autorize as requisições com o JWT obtido em `POST /login`.
2. Em `PATCH /my-image`, envie um PNG ou JPEG de até 5 MiB no campo `foto` do formulário.
3. A resposta `200` contém o campo `url`. Abra esse endereço no navegador para visualizar a foto sem precisar do JWT.

Os arquivos ficam na pasta `uploads/` da raiz do projeto, criada no primeiro upload. O backend disponibiliza essas imagens em `/uploads/`, com URLs como `http://localhost:3333/uploads/<uuid>.png`.
