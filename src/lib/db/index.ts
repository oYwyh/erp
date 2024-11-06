// local postgress
// import { drizzle } from 'drizzle-orm/postgres-js' // the way we connect
// import * as schema from './schema' // getting the schema
// import postgres from 'postgres' // getting the database driver

// import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";

// export const client = postgres(process.env.DATABASE_URL as string, { max: 1 })
// export const db: PostgresJsDatabase<typeof schema> = drizzle(client, { schema, logger: true /* to log all the sql query we make */ })

// export default db;

// Vercel
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema' // getting the schema

export const db = drizzle({ client: sql, schema, logger: true })

export default db;