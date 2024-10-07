FROM node:lts-bookworm-slim

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm i -g pnpm && pnpm i && pnpm store prune
 
RUN chown -R node node_modules

USER node

CMD [ "pnpm", "dev", "--host" ]