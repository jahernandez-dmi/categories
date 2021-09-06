ARG NODE_VERSION=14

FROM node:${NODE_VERSION} as base
WORKDIR /opt/node_app
COPY package*.json ./

FROM base as release-dependencies
ARG NPM_TOKEN
RUN npm config set "@devgurusio:registry=https://npm.pkg.github.com" && \
    npm config set "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" && \
    npm set progress=false      &&\
    npm config set depth 0      &&\
    npm ci --only=production    &&\
    npm cache clean --force

FROM node:${NODE_VERSION}-alpine3.14 AS release
USER node
WORKDIR /opt/node_app
COPY --from=release-dependencies /opt/node_app/ .
COPY . .
CMD [ "node", "index.js" ]
