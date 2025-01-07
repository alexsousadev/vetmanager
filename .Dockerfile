# Use a imagem base do Node.js
FROM node:20.9.0

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de configuração e dependências do projeto para o container
COPY package.json package-lock.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o código do projeto para o container
COPY . .

# Compila o código TypeScript para JavaScript
RUN npm run build

# Expõe a porta usada pelo servidor (ajuste conforme necessário)
EXPOSE 3000

# Define o comando para rodar o servidor no container
CMD ["npm", "start"]
