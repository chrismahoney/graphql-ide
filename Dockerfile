FROM node:14.15-alpine AS builder

ARG ENV
ARG SCHEME
ARG DOMAIN
ARG REACT_APP_IDE_URL

ENV NODE_ENV=${ENV:-production}
ENV BACKEND_URL=${SCHEME:-https}://${DOMAIN:-graphql.lamina1.dev}
ENV REACT_APP_IDE_URL=${REACT_APP_IDE_URL:-/ide}
ENV PUBLIC_URL=$BACKEND_URL$REACT_APP_IDE_URL
ENV IDE_URL=$PUBLIC_URL
ENV REACT_APP_ENDPOINT_URL=$PUBLIC_URL

WORKDIR /app

COPY package.json package-lock.json* ./

RUN chown node:node -R /app

RUN apk add python make g++

USER root

RUN npm install -g nodemon && npm install --production

COPY --chown=node:node . .

RUN npm run build

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
