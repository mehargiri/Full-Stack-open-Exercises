FROM node:lts-bookworm-slim AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm i -g pnpm

RUN pnpm i --frozen-lockfile

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

FROM build-stage AS test-stage

RUN pnpm test

RUN pnpm build

FROM nginx:mainline-bookworm

COPY --from=test-stage /usr/src/app/dist /usr/share/nginx/html