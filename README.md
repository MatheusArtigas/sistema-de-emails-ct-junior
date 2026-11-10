# Sistema de E-mails | CT Junior

API de mensagens internas entre usuários cadastrados. O usuário pode enviar mensagens, consultar as caixas de entrada e saída e excluir uma mensagem enviada enquanto ela ainda não foi lida.

## Tecnologias

- Node.js, TypeScript e Fastify
- Prisma 8 ORM e PostgreSQL
- Docker 
- JWT para autenticação
- Bcrypt para gerar senhas encriptadas
- Swagger para documentação da API
- Zod para validações de dados
- Vitest para testes unitários

## Como rodar localmente

Você vai precisar de Node.js 24, npm e Docker com Docker Compose.

Na raiz do projeto, instale as dependências e crie um arquivo `.env` com base no `.env.example`. Defina seu próprio valor para `JWT_SECRET`.

```bash
npm ci
```

Suba o PostgreSQL, inicialize o banco e inicie a API.

```bash
docker compose up -d
npx prisma db init
npm run dev
```

Com a porta padrão, a documentação interativa fica em [http://localhost:3333/docs](http://localhost:3333/docs).

## Demonstração no Swagger

1. Cadastre duas contas em `POST /user`, (exemplo: uma para Lara e outra para Matheus).
2. Faça login como Lara em `POST /login` e use o token retornado no botão **Authorize**.
3. Envie uma mensagem para o endereço de Matheus em `POST /email`. Consulte `GET /sent-emails` e confira se Matheus aparece como `destinatario`. Guarde o `email_id`.
4. Faça login como Matheus e troque o token no Swagger. Consulte `GET /my-emails` e confira se Lara aparece como `remetente`. Abra a mensagem em `GET /email/{id}` para marcá-la como lida.
5. Volte a usar o token de Lara. Em `GET /sent-emails`, confira se `jaVisto` passou para `true`. Tente excluir a mensagem em `DELETE /email/{id}` e verifique se a API recusa a exclusão.

## Estrutura do projeto

| Pasta | Responsabilidade |
| --- | --- |
| `src/http` | Rotas, controllers, autenticação das requisições e schemas do Swagger |
| `src/use-cases` | Regras de negócio e testes unitários |
| `src/repositories` | Interfaces e implementações com Prisma e em memória |
| `src/prisma` | Contrato de dados e configuração do cliente do banco |

## Testes

```bash
npm test
```

Os testes unitários usam repositórios em memória e rodam sem o PostgreSQL. Eles cobrem cadastro, autenticação, envio, leitura, listagem e exclusão de mensagens, além de operações de perfil.

## Foto de perfil

Com um token válido, use `PATCH /my-image` no Swagger. Envie um PNG ou JPEG de até 5 MiB no campo `foto` do formulário. A resposta contém a `url` da imagem, que pode ser aberta no navegador sem autenticação.