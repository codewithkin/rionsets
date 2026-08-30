import type { Database } from "../db/database";
import type { Routine, Workout } from "../db/schema";

export interface ReminderPlan {
  routineId: string;
  routineName: string;
  reminderDate: number;
  daysSince: number;
  kind: "overdue" | "due-today" | "due-soon";
}

export interface ReminderConfig {
  lookAheadDays: number;
  overdueFactor: number;
}

export const DEFAULT_REMINDER_CONFIG: ReminderConfig = {
  lookAheadDays: 7,
  overdueFactor: 1.2,
};

export const DAY_MS = 86_400_000;

export class NotificationPlanner {
  constructor(private readonly db: Database) {}

  async planReminders(now = Date.now(), config: ReminderConfig = DEFAULT_REMINDER_CONFIG): Promise<ReminderPlan[]> {
    const routines = await this.db.findAll<Routine>("routine");
    const workouts = await this.db.findAll<Workout>("workout");

    const plans: ReminderPlan[] = [];
    for (const routine of routines) {
      const routineWorkouts = workouts
        .filter((w) => w.routineId === routine.id)
        .map((w) => w.startedAt)
        .sort((a, b) => a - b);
      const lastTrainedAt = routineWorkouts[routineWorkouts.length - 1];
      if (lastTrainedAt == null) continue;

      const daysSince = (now - lastTrainedAt) / DAY_MS;
      const intervalDays = 7 / routine.daysPerWeek;
      const expectedNext = lastTrainedAt + intervalDays * DAY_MS;
      const overdueThreshold = intervalDays * config.overdueFactor;
      const isOverdue = daysSince >= overdueThreshold;

      let kind: ReminderPlan["kind"];
      if (isOverdue) {
        kind = "overdue";
      } else if (daysSince >= intervalDays) {
        kind = "due-today";
      } else {
        kind = "due-soon";
      }

      if (daysSince > config.lookAheadDays) continue;

      plans.push({
        routineId: routine.id,
        routineName: routine.name,
        reminderDate: Math.max(now, expectedNext),
        daysSince: Math.floor(daysSince),
        kind,
      });
    }

    plans.sort((a, b) => a.reminderDate - b.reminderDate);
    return plans;
  }
}
