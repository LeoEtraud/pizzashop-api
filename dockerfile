# Use a imagem oficial do Node.js
FROM node:20

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Build da aplicação
RUN npm run build

# Copie o restante da aplicação
COPY . .

# Exponha a porta na qual a aplicação vai rodar
EXPOSE 3000

# Inicie a aplicação
CMD ["npm", "start"]
