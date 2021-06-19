# Base stage
FROM node:14-slim as base
RUN apt-get update && apt-get install -y \
    python \
    build-essential \
    curl \
 && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node
COPY --chown=node:node package.json package-lock*.json ./
RUN npm ci && npm cache clean --force

# Local Development stage
FROM base as dev
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:$PATH
RUN npm install --only=development
CMD ["npm", "run", "dev"]
