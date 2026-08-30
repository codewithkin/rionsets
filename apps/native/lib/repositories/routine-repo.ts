import type { Database } from "../db/database";
import { RoutineSchema, type Routine } from "../db/schema";
import { generateId } from "../utils/id";

export type RoutineSplit = Routine["split"];

export class RoutineRepository {
  constructor(private readonly db: Database) {}

  async create(
    input: Pick<Routine, "name" | "split" | "daysPerWeek"> & { exerciseIds?: string[] },
    now = Date.now(),
  ): Promise<Routine> {
    const routine = RoutineSchema.parse({
      id: generateId("rt"),
      name: input.name,
      split: input.split,
      daysPerWeek: input.daysPerWeek,
      exerciseIds: input.exerciseIds ?? [],
      createdAt: now,
    });
    await this.db.insert("routine", routine);
    return routine;
  }

  async findById(id: string): Promise<Routine | undefined> {
    return this.db.findById<Routine>("routine", id);
  }

  async findAll(): Promise<Routine[]> {
    return this.db.findAll<Routine>("routine");
  }

  async update(
    id: string,
    patch: Partial<Pick<Routine, "name" | "split" | "daysPerWeek" | "exerciseIds">>,
  ): Promise<void> {
    await this.db.update("routine", id, patch);
  }

  async remove(id: string): Promise<void> {
    await this.db.remove("routine", id);
  }
}
