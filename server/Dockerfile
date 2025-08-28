FROM node:18-alpine

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 8000

CMD ["node", "src/index.js"]
