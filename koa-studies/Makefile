## Variables ##

KNEXFILE :=  dist/src/config/knexfile.js

BOOTSTRAP := dist/src/bootstrap.js
BIN := node_modules/.bin

## Rules ##

compile:
	npx tsc -p ./tsconfig.build.json

watch:
	npx tsc -w -p ./tsconfig.build.json

node_modules: package.json
	npm install

up:
	docker-compose up -d

down:
	docker-compose down

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
