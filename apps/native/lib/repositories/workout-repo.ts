import type { Database } from "../db/database";
import { SetSchema, WorkoutSchema, type Set, type Workout } from "../db/schema";
import { generateId } from "../utils/id";

export class WorkoutRepository {
  constructor(private readonly db: Database) {}

  async create(input: Partial<Pick<Workout, "name" | "routineId">>, now = Date.now()): Promise<Workout> {
    const workout = WorkoutSchema.parse({
      id: generateId("wo"),
      name: input.name ?? "Workout",
      routineId: input.routineId,
      startedAt: now,
    });
    await this.db.insert("workout", workout);
    return workout;
  }

  async findById(id: string): Promise<Workout | undefined> {
    return this.db.findById<Workout>("workout", id);
  }

  async findAll(): Promise<Workout[]> {
    return this.db.findAll<Workout>("workout");
  }

  async complete(id: string, completedAt = Date.now()): Promise<void> {
    await this.db.update("workout", id, { completedAt });
  }

  async update(id: string, patch: Partial<Pick<Workout, "name" | "routineId">>): Promise<void> {
    await this.db.update("workout", id, patch);
  }

  async remove(id: string): Promise<void> {
    await this.db.transaction(async () => {
      const sets = await this.db.findBy<Set>("set", (s) => s.workoutId === id);
      for (const set of sets) {
        await this.db.remove("set", set.id);
      }
      await this.db.remove("workout", id);
    });
  }

  async setsFor(workoutId: string): Promise<Set[]> {
    const sets = await this.db.findBy<Set>("set", (s) => s.workoutId === workoutId);
    return sets.sort((a, b) => a.orderIndex - b.orderIndex);
  }
}

export class SetRepository {
  constructor(private readonly db: Database) {}

  async append(workoutId: string, input: Partial<Omit<Set, "id" | "workoutId" | "orderIndex">>): Promise<Set> {
    return this.db.transaction(async () => {
      const existing = await this.db.findBy<Set>("set", (s) => s.workoutId === workoutId);
      const orderIndex = existing.length;
      const set = SetSchema.parse({
        id: generateId("st"),
        workoutId,
        orderIndex,
        weight: input.weight ?? 0,
        reps: input.reps ?? 0,
        isWarmup: input.isWarmup ?? false,
        isDropSet: input.isDropSet ?? false,
        isFailure: input.isFailure ?? false,
        rpe: input.rpe,
        rir: input.rir,
        note: input.note,
        isPerHand: input.isPerHand ?? false,
        addedWeight: input.addedWeight ?? 0,
        ratio: input.ratio,
        exerciseId: input.exerciseId ?? "",
      });
      await this.db.insert("set", set);
      return set;
    });
  }

  async update(id: string, patch: Partial<Omit<Set, "id" | "workoutId">>): Promise<void> {
    await this.db.update("set", id, patch);
  }

  async remove(id: string): Promise<void> {
    await this.db.remove("set", id);
  }

  async forExercise(exerciseId: string): Promise<Set[]> {
    return this.db.findBy<Set>("set", (s) => s.exerciseId === exerciseId);
  }
}
