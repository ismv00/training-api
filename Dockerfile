FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Instalar TypeScript globalmente (se necessário)
RUN npm install -g typescript

# Compilar TypeScript para JavaScript
RUN npm run build  # Certifique-se de ter um script de build no package.json

# Expor a porta 3000
EXPOSE 3000


# Comando para iniciar a aplicação
CMD ["sh", "-c", "npm start"]
