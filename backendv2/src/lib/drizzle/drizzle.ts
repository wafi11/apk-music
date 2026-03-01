import { drizzle } from "drizzle-orm/node-postgres";
import { DATABASE_URL } from "./contants";

export const db = drizzle({
  connection: {
    connectionString: DATABASE_URL,
    ssl: false,
  },
});
