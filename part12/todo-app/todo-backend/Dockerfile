FROM node:lts-bullseye-slim

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm i -g pnpm

RUN pnpm i --frozen-lockfile --prod

ENV DEBUG=playground:*

ENV NODE_ENV=production

USER node

CMD [ "pnpm", "start" ]