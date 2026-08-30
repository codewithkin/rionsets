import type { Database } from "../db/database";
import { ExerciseSchema, type Exercise } from "../db/schema";
import { generateId } from "../utils/id";

export interface SeedExercise {
  name: string;
  equipmentType: Exercise["equipmentType"];
  muscleGroup?: string;
}

export const EXERCISE_LIBRARY: SeedExercise[] = [
  { name: "Barbell Back Squat", equipmentType: "barbell", muscleGroup: "legs" },
  { name: "Barbell Bench Press", equipmentType: "barbell", muscleGroup: "chest" },
  { name: "Barbell Deadlift", equipmentType: "barbell", muscleGroup: "back" },
  { name: "Overhead Press", equipmentType: "barbell", muscleGroup: "shoulders" },
  { name: "Barbell Row", equipmentType: "barbell", muscleGroup: "back" },
  { name: "Pull-Up", equipmentType: "bodyweight", muscleGroup: "back" },
  { name: "Dip", equipmentType: "bodyweight", muscleGroup: "chest" },
  { name: "Dumbbell Curl", equipmentType: "dumbbell", muscleGroup: "arms" },
  { name: "Dumbbell Lateral Raise", equipmentType: "dumbbell", muscleGroup: "shoulders" },
  { name: "Leg Press", equipmentType: "machine", muscleGroup: "legs" },
  { name: "Lat Pulldown", equipmentType: "cable", muscleGroup: "back" },
  { name: "Seated Cable Row", equipmentType: "cable", muscleGroup: "back" },
];

export class ExerciseRepository {
  constructor(private readonly db: Database) {}

  async create(
    input: Omit<Exercise, "id" | "createdAt" | "isCustom">,
    now = Date.now(),
  ): Promise<Exercise> {
    const exercise = ExerciseSchema.parse({
      ...input,
      id: generateId("ex"),
      createdAt: now,
      isCustom: true,
    });
    await this.db.insert("exercise", exercise);
    return exercise;
  }

  async findById(id: string): Promise<Exercise | undefined> {
    return this.db.findById<Exercise>("exercise", id);
  }

  async findAll(): Promise<Exercise[]> {
    return this.db.findAll<Exercise>("exercise");
  }

  async update(id: string, patch: Partial<Pick<Exercise, "name" | "muscleGroup" | "machineRatio">>): Promise<void> {
    await this.db.update("exercise", id, patch);
  }

  async remove(id: string): Promise<void> {
    await this.db.remove("exercise", id);
  }

  async seedLibrary(now = Date.now()): Promise<void> {
    const existing = await this.findAll();
    const existingNames = new Set(existing.map((e) => e.name));
    const toInsert: Exercise[] = EXERCISE_LIBRARY.filter((seed) => !existingNames.has(seed.name)).map(
      (seed, i) =>
        ExerciseSchema.parse({
          ...seed,
          id: `seed-${i}`,
          createdAt: now,
          isCustom: false,
        }),
    );
    if (toInsert.length > 0) {
      await this.db.insertMany("exercise", toInsert);
    }
  }
}
