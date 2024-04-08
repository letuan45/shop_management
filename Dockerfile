# BUILD
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
COPY ./prisma prisma

RUN npm install

COPY . .

RUN npm run build

# PRODUCTION
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV production

COPY package*.json ./
COPY --chown=node:node --from=build /app/prisma /app/prisma
COPY --chown=node:node --from=build /app/dist  /app/dist
RUN npm install --only=production

EXPOSE 8080

CMD [  "npm", "run", "start:migrate:prod" ]