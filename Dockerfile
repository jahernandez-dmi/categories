ARG NODE_VERSION=12
FROM node:${NODE_VERSION} as builder

COPY package.json package-lock.json* ./
RUN npm install --no-optional && npm cache clean --force

# FINAL IMAGGE
FROM node:${NODE_VERSION}-alpine as release

ARG TINI_VERSION=v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

WORKDIR /home/node/app
COPY --from=builder node_modules .

USER node
ENTRYPOINT ["/tini", "--"]
CMD ["node", "start"]

