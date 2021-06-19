## Variables ##

KNEXFILE :=  dist/src/config/knexfile.js
SWAGGERFILE :=  docs/swagger.yaml

BOOTSTRAP := dist/src/bootstrap.js
BIN := node_modules/.bin
# You can define your local flags for Mocha here and they will be added to the Mocha command.
# The ideal place to set this is in a git-ignored `local.mk` file, like this:
# MOCHA_OVERRIDES += --bail --reporter custom-reporter
MOCHA_OVERRIDES :=

## Rules ##

compile:
	npx tsc -p ./tsconfig.build.json

watch:
	npx tsc -w -p ./tsconfig.build.json

node_modules: package.json
	npm install

install: node_modules

install-ci: package.json package-lock.json
	npm ci

test: reset-test-db
	NODE_ENV=test npx mocha ${MOCHA_OVERRIDES}

test-docker:
	docker-compose -f docker-compose.test.yml run --rm api

test-update: reset-test-db
	NODE_ENV=test npx mocha --update ${MOCHA_OVERRIDES}

test-watch: reset-test-db
	NODE_ENV=test npx mocha -w --watch-extensions ts ${MOCHA_OVERRIDES}

coverage: reset-test-db
	NODE_ENV=test npx nyc mocha ${MOCHA_OVERRIDES}

publish-coverage:
	npx codecov

run: compile
	node -r tsconfig-paths/register -r $(BOOTSTRAP) ./dist/src/cluster

develop: compile
	npx nodemon --watch src --ext ts --exec "node $(BIN)/nf start -j Procfile.dev || exit 1"

develop-docker:
	docker-compose up -d

develop-docker-stop:
	docker-compose down

develop-api-logs:
	docker-compose logs --follow api

lint-code:
	npx eslint --ext ts .

lint-docs:
	npx speccy lint $(SWAGGERFILE)

lint: lint-docs lint-code

migrate:
	node -r tsconfig-paths/register -r $(BOOTSTRAP) $(BIN)/knex migrate:latest --knexfile=$(KNEXFILE)

rollback:
	node -r tsconfig-paths/register -r $(BOOTSTRAP) $(BIN)/knex migrate:rollback --knexfile=$(KNEXFILE)

reset-test-db: compile
	NODE_ENV=test node -r tsconfig-paths/register -r $(BOOTSTRAP) $(BIN)/knex migrate:rollback --knexfile=$(KNEXFILE)
	NODE_ENV=test node -r tsconfig-paths/register -r $(BOOTSTRAP) $(BIN)/knex migrate:latest --knexfile=$(KNEXFILE)

reset-dev-db: compile
	node -r tsconfig-paths/register -r $(BOOTSTRAP) $(BIN)/knex migrate:rollback --knexfile=$(KNEXFILE)
	node -r tsconfig-paths/register $(BIN)/knex migrate:latest --knexfile=$(KNEXFILE)

reset-dev-db-seed: compile
	node -r tsconfig-paths/register -r $(BOOTSTRAP) $(BIN)/knex migrate:rollback --knexfile=$(KNEXFILE)
	node -r tsconfig-paths/register -r $(BOOTSTRAP) $(BIN)/knex migrate:latest --knexfile=$(KNEXFILE)
	node -r tsconfig-paths/register -r $(BOOTSTRAP) $(BIN)/knex seed:run --knexfile=$(KNEXFILE)

infra:
	docker-compose -f docker-compose.no-api.yml up -d --force-recreate

infra-stop:
	docker-compose -f docker-compose.no-api.yml stop

infra-restart: infra-stop infra

.PHONY: compile
.PHONY: watch
.PHONY: install
.PHONY: install-ci
.PHONY: test
.PHONY: test-docker
.PHONY: test-update
.PHONY: test-watch
.PHONY: coverage
.PHONY: publish-coverage
.PHONY: run
.PHONY: develop
.PHONY: develop-docker
.PHONY: develop-docker-stop
.PHONY: lint-code
.PHONY: lint-docs
.PHONY: lint
.PHONY: migrate
.PHONY: rollback
.PHONY: reset-test-db
.PHONY: reset-dev-db
.PHONY: reset-dev-db-seed
.PHONY: infra
.PHONY: infra-stop
.PHONY: infra-restart
