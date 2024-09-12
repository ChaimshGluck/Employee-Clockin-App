import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import pkg from 'pg-connection-string';
const { parse } = pkg;
const { host, port, database, user, password } = parse(process.env.DATABASE_URL || '');

const client = postgres({
    host,
    port,
    database,
    user,
    password,
    ssl: true
});

const db = drizzle(client);

export default db;