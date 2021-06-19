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
CMD [
        "nodemon", "--watch", "./dist", "--inspect=0.0.0.0:9222", "--nolazy",
        "-r", "tsconfig-paths/register",
        "-r", "./dist/src/bootstrap.js",
        "./dist/src/api/server.js"
    ]

# Source code stage
FROM base as source
COPY --chown=node:node . .

# Test stage
FROM source as test
ENV NODE_ENV=development
COPY --from=dev /app/node_modules /app/node_modules
RUN make lint-code
# RUN make test. TODO: Unit/Integration tests split needed before running tests during image build process.

# Optional Audit stage. Uncomment with proper aquasec credentials (env var MICROSCANNER_TOKEN) ⚠️
# FROM test as audit
# USER root
# RUN npm audit --audit-level critical
# ARG MICROSCANNER_TOKEN
# ADD https://get.aquasec.com/microscanner /
# RUN chmod +x /microscanner
# RUN /microscanner $MICROSCANNER_TOKEN --continue-on-failure

# TS Build stage
FROM source as build
COPY --from=dev /app/node_modules /app/node_modules
RUN make compile

# Production final stage
FROM build as prod
COPY --from=build /app/dist /app/dist
HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:${PORT:-3000}/healthz || exit 1
CMD ["node", "-r", "tsconfig-paths/register", "-r", "dist/src/bootstrap.js", "./dist/src/api/server"]
