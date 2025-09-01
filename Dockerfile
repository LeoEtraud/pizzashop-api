# Use a imagem oficial do Node.js
FROM node:20

# Instalar o bash
RUN apt-get update && apt-get install -y bash

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

# Copie todo o restante da aplicação
COPY . .

# Verifique a estrutura de arquivos dentro do contêiner
RUN ls -R /app

# Build da aplicação usando bun (ajustando o caminho para o arquivo correto)
RUN bun build --target=node src/server.ts || cat /app/node_modules/@faker-js/faker/dist/cjs/modules/error.log


# Exponha a porta na qual a aplicação vai rodar
EXPOSE 3000

# Inicie a aplicação
CMD ["node", "dist/server.js"]
