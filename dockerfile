# Use a imagem oficial do Node.js
FROM node:20

# Instalar o bun
RUN curl -fsSL https://bun.sh/install | bash

# Adicionar o diretório do bun ao PATH
ENV PATH="/root/.bun/bin:${PATH}"

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Build da aplicação usando bun
RUN bun build --target=node src/http/server.ts

# Copie o restante da aplicação
COPY . .

# Exponha a porta na qual a aplicação vai rodar
EXPOSE 3000

# Inicie a aplicação
CMD ["bun", "run", "start"]
