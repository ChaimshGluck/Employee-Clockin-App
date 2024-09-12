import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';
import { parse } from 'pg-connection-string';

const { host, port, database, user, password } = parse(process.env.DATABASE_URL || '');

export default defineConfig({
    dialect: 'postgresql',
    dbCredentials: {
        host,
        port,
        database,
        user,
        password,
        ssl: true
    },
    out: './drizzle',
    schema: ['timesheet'],
    schemaFilter: 'timesheet'
});