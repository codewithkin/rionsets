import type { Database } from "../db/database";
import type { Exercise, Routine, Set, Workout } from "../db/schema";

export function escapeCsv(value: unknown): string {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function rowsToCsv(headers: string[], rows: Array<Array<unknown>>): string {
  const lines = [headers.map(escapeCsv).join(",")];
  for (const row of rows) {
    lines.push(row.map(escapeCsv).join(","));
  }
  return lines.join("\n") + "\n";
}

export class CsvExportService {
  constructor(private readonly db: Database) {}

  async exercises(): Promise<string> {
    const rows = await this.db.findAll<Exercise>("exercise");
    return rowsToCsv(
      ["id", "name", "equipmentType", "muscleGroup", "machineRatio", "isCustom", "createdAt"],
      rows.map((e) => [e.id, e.name, e.equipmentType, e.muscleGroup ?? "", e.machineRatio ?? "", e.isCustom ? 1 : 0, e.createdAt]),
    );
  }

  async workouts(): Promise<string> {
    const rows = await this.db.findAll<Workout>("workout");
    return rowsToCsv(
      ["id", "routineId", "name", "startedAt", "completedAt"],
      rows.map((w) => [w.id, w.routineId ?? "", w.name, w.startedAt, w.completedAt ?? ""]),
    );
  }

  async sets(): Promise<string> {
    const rows = await this.db.findAll<Set>("set");
    return rowsToCsv(
      [
        "id",
        "workoutId",
        "exerciseId",
        "orderIndex",
        "weight",
        "reps",
        "isWarmup",
        "isDropSet",
        "isFailure",
        "rpe",
        "rir",
        "note",
        "isPerHand",
        "addedWeight",
        "ratio",
      ],
      rows.map((s) => [
        s.id,
        s.workoutId,
        s.exerciseId,
        s.orderIndex,
        s.weight,
        s.reps,
        s.isWarmup ? 1 : 0,
        s.isDropSet ? 1 : 0,
        s.isFailure ? 1 : 0,
        s.rpe ?? "",
        s.rir ?? "",
        s.note ?? "",
        s.isPerHand ? 1 : 0,
        s.addedWeight,
        s.ratio ?? "",
      ]),
    );
  }

  async routines(): Promise<string> {
    const rows = await this.db.findAll<Routine>("routine");
    return rowsToCsv(
      ["id", "name", "split", "daysPerWeek", "exerciseIds", "createdAt"],
      rows.map((r) => [r.id, r.name, r.split, r.daysPerWeek, r.exerciseIds.join("|"), r.createdAt]),
    );
  }

  async all(): Promise<Record<string, string>> {
    return {
      exercises: await this.exercises(),
      workouts: await this.workouts(),
      sets: await this.sets(),
      routines: await this.routines(),
    };
  }
}
