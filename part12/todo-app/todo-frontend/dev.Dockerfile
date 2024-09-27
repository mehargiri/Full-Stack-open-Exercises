FROM node:lts-bookworm-slim AS build-stage

WORKDIR /usr/src/app

COPY --chown=node:node . .

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm i -g pnpm

RUN pnpm i

USER node

CMD [ "pnpm", "dev", "--host" ]