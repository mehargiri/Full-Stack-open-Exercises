FROM node:lts-bookworm-slim

WORKDIR /usr/src/app

COPY --chown=node:node . .

ARG PORT
ARG JWT_SECRET
ARG TEST_MONGO_URI
ARG PROD_MONGO_URI

ENV PORT=${PORT}
ENV JWT_SECRET=${JWT_SECRET}
ENV TEST_MONGO_URI=${TEST_MONGO_URI}
ENV PROD_MONGO_URI=${PROD_MONGO_URI}

RUN npm i -g pnpm && pnpm i --frozen-lockfile && pnpm store prune

USER node

RUN pnpm test:ci

CMD [ "pnpm", "start:cloud" ]