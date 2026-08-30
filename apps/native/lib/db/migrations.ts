import type { Migration } from "./database";

export const INITIAL_SCHEMA_SQL: string[] = [
  `CREATE TABLE IF NOT EXISTS exercise (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    equipmentType TEXT NOT NULL,
    muscleGroup TEXT,
    machineRatio REAL,
    isCustom INTEGER NOT NULL DEFAULT 0,
    createdAt INTEGER NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS routine (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    split TEXT NOT NULL,
    daysPerWeek INTEGER NOT NULL,
    exerciseIds TEXT NOT NULL,
    createdAt INTEGER NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS workout (
    id TEXT PRIMARY KEY NOT NULL,
    routineId TEXT,
    name TEXT NOT NULL,
    startedAt INTEGER NOT NULL,
    completedAt INTEGER
  );`,
  `CREATE TABLE IF NOT EXISTS "set" (
    id TEXT PRIMARY KEY NOT NULL,
    workoutId TEXT NOT NULL,
    exerciseId TEXT NOT NULL,
    orderIndex INTEGER NOT NULL,
    weight REAL NOT NULL,
    reps INTEGER NOT NULL,
    isWarmup INTEGER NOT NULL DEFAULT 0,
    isDropSet INTEGER NOT NULL DEFAULT 0,
    isFailure INTEGER NOT NULL DEFAULT 0,
    rpe REAL,
    rir REAL,
    note TEXT,
    isPerHand INTEGER NOT NULL DEFAULT 0,
    addedWeight REAL NOT NULL DEFAULT 0,
    ratio REAL
  );`,
];

export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    name: "initial-schema",
    up: async ({ exec }) => {
      for (const sql of INITIAL_SCHEMA_SQL) {
        await exec(sql);
      }
    },
  },
];
