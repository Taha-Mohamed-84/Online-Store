import dotinv from 'dotenv';
import { Pool } from 'pg';

dotinv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_Test_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  ENV
} = process.env;

let client = new Pool({
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD
});

if (ENV === 'test') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_Test_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
  });
}
if (ENV === 'dev') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
  });
}

export default client;
