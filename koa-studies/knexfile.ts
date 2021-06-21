import * as path from 'path';
import * as dotenv from 'dotenv';

const ROOT: string = path.resolve(__dirname, '../../');
dotenv.config({path: path.join(ROOT, '.env')});

const { DB_CLIENT, DB_CONNECTION, DB_CONNECTION_TEST, DB_CONNECTION_PRODUCTION } = process.env;
// tslint:disable-next-line
const options: any = {
  client: process.env.DB_CLIENT ,
  connection: DB_CONNECTION,
  // connection: {
  //   host: '127.0.0.1',
  //   user: 'postgres',
  //   password: 'postgres',
  //   port: 5432,
  //   database: 'postgres'
  // },
  migrations: {
    directory: path.join(ROOT, 'src/api/database/migrations'),
    tableName: 'migrations'
  },
  debug: false,
  seeds: {
    directory: path.join(ROOT, 'src/api/database/seeds')
  },
  useNullAsDefault: !DB_CLIENT
};

if (DB_CLIENT) {
  options.pool = {
    min: 2,
    max: 10
  };
}

// tslint:disable-next-line
export const knexfile: any = {

  development: Object.assign({}, options),

  test: Object.assign({}, options, {
    connection: DB_CONNECTION_TEST
  }),

  production: Object.assign({}, options, {
    connection: DB_CONNECTION_PRODUCTION
  })

};
