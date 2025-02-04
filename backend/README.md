# VetManager

O **VetManager** é um sistema que visa facilitar a gestão da saúde de animais de estimação, conectando tutores a clínicas veterinárias

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no servidor.
- **Express**: Framework para construção de APIs.
- **Prisma**: ORM para interagir com o banco de dados.
- **PostgreSQL**: Sistema de gerenciamento de banco de dados.
- **JWT**: Para autenticação de usuários.
- **Bcrypt**: Para hash de senhas.
- **Zod**: Para validação de dados.

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seuusuario/vetmanager.git
   cd vetmanager
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto e adicione a variável `DATABASE_URL` (obrigatório) com a URL de conexão do seu banco de dados PostgreSQL e a palavra-chave do Token JWT com a variável `JWT_SECRET_KEY` (opcional)

4. Execute as inicializações do Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Inicie o servidor:
   ```bash
   npm start
   ```

## Uso

- Acesse a aplicação em `http://localhost:3000`
