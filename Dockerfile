FROM node:lts-alpine

RUN apk add curl \
    && apk add bash \
    && curl -L https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh > /usr/bin/wait-for-it.sh \
    && chmod +x /usr/bin/wait-for-it.sh
RUN npm install -g pnpm

WORKDIR /usr/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

RUN pnpm prisma generate