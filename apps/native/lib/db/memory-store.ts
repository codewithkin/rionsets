import { CURRENT_SCHEMA_VERSION, type Database, type Row, type TableName } from "./database";
import { MIGRATIONS } from "./migrations";
import { getEmptyCollectionsState } from "./collections";

export class MemoryDatabase implements Database {
  readonly version = CURRENT_SCHEMA_VERSION;

  readonly collections: Record<TableName, Array<Row & { id: string }>> = getEmptyCollectionsState() as Record<
    TableName,
    Array<Row & { id: string }>
  >;

  async migrate(): Promise<void> {
    for (const migration of MIGRATIONS) {
      await migration.up({
        exec: async () => {},
        run: async (table, row) => {
          await this.insert(table, row);
        },
      });
    }
  }

  async insert(table: TableName, row: Row & { id: string }): Promise<void> {
    this.collections[table].push(row);
  }

  async insertMany(table: TableName, rows: Array<Row & { id: string }>): Promise<void> {
    this.collections[table].push(...rows);
  }

  async update(table: TableName, id: string, patch: Partial<Row>): Promise<void> {
    const idx = this.collections[table].findIndex((r) => r.id === id);
    if (idx >= 0) {
      this.collections[table][idx] = { ...this.collections[table][idx], ...patch };
    }
  }

  async remove(table: TableName, id: string): Promise<void> {
    this.collections[table] = this.collections[table].filter((r) => r.id !== id);
  }

  async findAll<T extends Row>(table: TableName): Promise<T[]> {
    return this.collections[table] as unknown as T[];
  }

  async findById<T extends Row>(table: TableName, id: string): Promise<T | undefined> {
    return this.collections[table].find((r) => r.id === id) as T | undefined;
  }

  async findBy<T extends Row>(
    table: TableName,
    predicate: (row: T) => boolean,
  ): Promise<T[]> {
    return this.collections[table].filter((r) => predicate(r as unknown as T)) as unknown as T[];
  }

  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    return fn();
  }
}
