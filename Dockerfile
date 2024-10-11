# Usar a imagem base do Node.js
FROM node:20

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código-fonte para o contêiner
COPY . .

# Expor a porta que o app irá rodar
EXPOSE 3000

# Comando para iniciar o aplicativo
CMD ["npm", "start"]
