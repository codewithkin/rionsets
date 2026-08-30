import { z } from "zod";

export const EquipmentTypeSchema = z.enum([
  "barbell",
  "dumbbell",
  "machine",
  "bodyweight",
  "cable",
]);
export type EquipmentType = z.infer<typeof EquipmentTypeSchema>;

export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  equipmentType: EquipmentTypeSchema,
  muscleGroup: z.string().optional(),
  machineRatio: z.number().positive().optional(),
  isCustom: z.boolean().default(false),
  createdAt: z.number(),
});
export type Exercise = z.infer<typeof ExerciseSchema>;

export const RoutineSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  split: z.enum(["pull", "push", "legs", "upper", "lower", "full", "other"]),
  daysPerWeek: z.number().int().min(1).max(7),
  exerciseIds: z.array(z.string()).default([]),
  createdAt: z.number(),
});
export type Routine = z.infer<typeof RoutineSchema>;

export const WorkoutSchema = z.object({
  id: z.string(),
  routineId: z.string().optional(),
  name: z.string(),
  startedAt: z.number(),
  completedAt: z.number().optional(),
});
export type Workout = z.infer<typeof WorkoutSchema>;

export const SetSchema = z.object({
  id: z.string(),
  workoutId: z.string(),
  exerciseId: z.string(),
  orderIndex: z.number().int().min(0),
  weight: z.number().min(0),
  reps: z.number().int().min(0),
  isWarmup: z.boolean().default(false),
  isDropSet: z.boolean().default(false),
  isFailure: z.boolean().default(false),
  rpe: z.number().min(0).max(10).optional(),
  rir: z.number().min(0).optional(),
  note: z.string().optional(),
  isPerHand: z.boolean().default(false),
  addedWeight: z.number().default(0),
  ratio: z.number().positive().optional(),
});
export type Set = z.infer<typeof SetSchema>;
