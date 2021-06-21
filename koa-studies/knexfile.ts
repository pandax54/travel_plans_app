import dotenv from "dotenv";
dotenv.config();

const databaseConfig = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    listen_addresses: "*",
  },
  migrations: {
    tableName: "knex_migrations",
  },
};

// needed for CLI tool
export default {
  development: databaseConfig,
  production: databaseConfig,
  databaseConfig,
};
