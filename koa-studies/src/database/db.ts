import knex from 'knex';

import databaseConfig from "../../knexfile";

// Database
const knexConnection = knex(databaseConfig.development);


export default knexConnection
