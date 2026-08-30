import type { Database } from "../db/database";
import type { Exercise, Routine, Set, Workout } from "../db/schema";

export interface FullDataset {
  format: "iron-sets";
  version: 1;
  exportedAt: number;
  data: {
    exercises: Exercise[];
    routines: Routine[];
    workouts: Workout[];
    sets: Set[];
  };
}

export const DATASET_FORMAT = "iron-sets";
export const DATASET_VERSION = 1;

export class JsonExportService {
  constructor(private readonly db: Database) {}

  async export(): Promise<string> {
    const [exercises, routines, workouts, sets] = await Promise.all([
      this.db.findAll<Exercise>("exercise"),
      this.db.findAll<Routine>("routine"),
      this.db.findAll<Workout>("workout"),
      this.db.findAll<Set>("set"),
    ]);

    const dataset: FullDataset = {
      format: DATASET_FORMAT,
      version: DATASET_VERSION,
      exportedAt: Date.now(),
      data: { exercises, routines, workouts, sets },
    };
    return JSON.stringify(dataset, null, 2);
  }

  parse(raw: string): FullDataset {
    const parsed = JSON.parse(raw) as FullDataset;
    if (parsed.format !== DATASET_FORMAT) {
      throw new Error(`Unsupported export format: ${parsed.format}`);
    }
    if (parsed.version !== DATASET_VERSION) {
      throw new Error(`Unsupported dataset version: ${parsed.version}`);
    }
    return parsed;
  }

  async import(raw: string): Promise<{ imported: number }> {
    const dataset = this.parse(raw);
    for (const exercise of dataset.data.exercises) {
      await this.db.insert("exercise", exercise);
    }
    for (const routine of dataset.data.routines) {
      await this.db.insert("routine", routine);
    }
    for (const workout of dataset.data.workouts) {
      await this.db.insert("workout", workout);
    }
    for (const set of dataset.data.sets) {
      await this.db.insert("set", set);
    }
    return {
      imported:
        dataset.data.exercises.length +
        dataset.data.routines.length +
        dataset.data.workouts.length +
        dataset.data.sets.length,
    };
  }
}
