import { MemoryDatabase } from "./memory-store";
import type { Database } from "./database";

export type { Database, Migration, MigrationContext, Row, TableName } from "./database";
export * from "./schema";
export { MemoryDatabase };
export { INITIAL_SCHEMA_SQL, MIGRATIONS } from "./migrations";
export { CURRENT_SCHEMA_VERSION } from "./database";

export async function createDatabase(): Promise<Database> {
  const db = new MemoryDatabase();
  await db.migrate();
  return db;
}
