# Use uma imagem base do Node.js
FROM node:20.9.0

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/

# Copia os arquivos de configuração para o container
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Instala o TypeScript globalmente para evitar erros de "tsc not found"
RUN npm install -g typescript

# Gera o Prisma Client
RUN npx prisma generate

# Copia todo o código do projeto
COPY . .

# Compila o TypeScript
RUN npm run build

# Expõe a porta usada pelo servidor
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "./dist/app.js"]
