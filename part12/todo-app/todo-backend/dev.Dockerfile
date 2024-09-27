FROM node:lts-bookworm-slim

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm i -g pnpm

RUN pnpm i

ENV DEBUG=playground:*

USER node

CMD [ "pnpm", "dev" ]