# Usa a imagem base do Node.js
FROM node:18-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do projeto para o container
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código para o container
COPY . .

# Expõe a porta usada pelo React (por padrão, 3000)
EXPOSE 3000

# Comando para iniciar o app
CMD ["npm", "start"]
