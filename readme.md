

````markdown
# iTraining API

API para gerenciamento de treinos e exercícios do aplicativo **iTraining**.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) v14+
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (ou outro banco de dados compatível com o Prisma)

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/itraining-api.git
   ```
````

2. Instale as dependências:

   ```bash
   cd itraining-api
   npm install
   ```

3. Configure o banco de dados:

   - Crie um banco de dados PostgreSQL.
   - Copie o arquivo `.env.example` e renomeie para `.env`, preenchendo com os detalhes do banco de dados:

     ```bash
     DATABASE_URL="postgresql://usuario:senha@localhost:5432/seu_banco"
     ```

4. Rode as migrations do Prisma para criar as tabelas:

   ```bash
   npx prisma migrate dev
   ```

5. Inicie o servidor:

   ```bash
   npm run dev
   ```

   O servidor estará rodando em `http://localhost:3000`.

## Endpoints

### Autenticação

#### Registrar Usuário

- **URL**: `/users/register`
- **Método**: `POST`
- **Corpo**:

  ```json
  {
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "password": "senha123"
  }
  ```

#### Login

- **URL**: `/users/login`
- **Método**: `POST`
- **Corpo**:

  ```json
  {
    "email": "usuario@email.com",
    "password": "senha123"
  }
  ```

### Treinos

#### Criar Treino

- **URL**: `/workouts/:userId`
- **Método**: `POST`
- **Corpo**:

  ```json
  {
    "name": "Treino A",
    "description": "Treino de pernas"
  }
  ```

#### Listar Treinos

- **URL**: `/workouts/:userId`
- **Método**: `GET`

#### Deletar Treino

- **URL**: `/workouts/:userId/:workoutId`
- **Método**: `DELETE`

### Exercícios

#### Criar Exercício

- **URL**: `/workouts/:workoutId/exercises`
- **Método**: `POST`
- **Headers**: `multipart/form-data`
- **Corpo**:

  ```json
  {
    "name": "Supino",
    "sets": 3,
    "reps": 10,
    "startWeight": 50,
    "endWeight": 70
  }
  ```

- **Upload de Imagem**: Enviar a imagem do exercício como parte do `form-data` com o campo `image`.

#### Deletar Exercício

- **URL**: `/workouts/:userId/workouts/:workoutId/exercises/:exerciseId`
- **Método**: `DELETE`

## Tecnologias

- **Node.js**
- **Express**
- **Prisma ORM**
- **PostgreSQL**
- **Multer** (para upload de arquivos)

## Contribuição

Sinta-se à vontade para fazer um fork deste repositório e abrir Pull Requests com melhorias ou correções.

## Licença

Este projeto está licenciado sob a licença MIT.

```

```
