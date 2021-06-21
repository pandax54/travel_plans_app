## Variables ##

# KNEXFILE :=  dist/src/config/knexfile.js
KNEXFILE :=  src/config/knexfile.ts

# BOOTSTRAP := dist/src/bootstrap.js
BOOTSTRAP := src/bootstrap.ts
BIN := node_modules/.bin

## Rules ##

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
