import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';
import pkg from 'pg-connection-string';
const { parse } = pkg;
const { host, port, database, user, password } = parse(process.env.DATABASE_URL || '');
const ssl = process.env.SSL === 'true';

export default defineConfig({
    dialect: 'postgresql',
    dbCredentials: {
        host,
        port,
        database,
        user,
        password,
        ssl: ssl ? { rejectUnauthorized: false } : false
    },
    out: './drizzle',
    schema: ['timesheet'],
    schemaFilter: 'timesheet'
});
