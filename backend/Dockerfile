FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN mkdir -p uploads

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
