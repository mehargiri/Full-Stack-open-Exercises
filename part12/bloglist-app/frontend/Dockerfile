FROM node:lts-bookworm-slim AS test-stage

WORKDIR /usr/src/app

COPY --chown=node:node ./backend ./backend
COPY --chown=node:node ./frontend ./frontend

ARG PORT
ARG JWT_SECRET
ARG PROD_MONGO_URI
ARG TEST_MONGO_URI

ENV PORT=${PORT}
ENV JWT_SECRET=${JWT_SECRET}
ENV PROD_MONGO_URI=${PROD_MONGO_URI}
ENV TEST_MONGO_URI=${TEST_MONGO_URI}
ENV E2E=CI

RUN npm i -g pnpm --no-cache

RUN cd backend \ 
		&& pnpm i --frozen-lockfile --prod

RUN cd frontend \ 
		&& pnpm i --frozen-lockfile

RUN pnpm dlx playwright install chromium --with-deps

RUN chown -R node frontend/node_modules

USER node

RUN cd frontend && pnpm test

RUN cd backend && pnpm build:ui

USER root

RUN cd frontend && pnpm test:e2e

USER node

FROM nginx:mainline-bookworm

COPY --from=test-stage /usr/src/app/backend/dist /usr/share/nginx/html



