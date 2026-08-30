import type { Exercise, Routine, Set, Workout } from "./schema";

export type TableName = "exercise" | "routine" | "workout" | "set";

export type Row = Exercise | Routine | Workout | Set;

export interface Database {
  readonly version: number;
  migrate(): Promise<void>;
  insert(table: TableName, row: Row & { id: string }): Promise<void>;
  insertMany(table: TableName, rows: Array<Row & { id: string }>): Promise<void>;
  update(table: TableName, id: string, patch: Partial<Row>): Promise<void>;
  remove(table: TableName, id: string): Promise<void>;
  findAll<T extends Row>(table: TableName): Promise<T[]>;
  findById<T extends Row>(table: TableName, id: string): Promise<T | undefined>;
  findBy<T extends Row>(
    table: TableName,
    predicate: (row: T) => boolean,
  ): Promise<T[]>;
  transaction<T>(fn: () => Promise<T>): Promise<T>;
}

export interface MigrationContext {
  exec(sql: string): Promise<void>;
  run(table: TableName, row: Row & { id: string }): Promise<void>;
}

export interface Migration {
  version: number;
  name: string;
  up: (db: MigrationContext) => Promise<void>;
}

export const CURRENT_SCHEMA_VERSION = 1;
