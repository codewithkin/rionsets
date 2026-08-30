import type { Database } from "../db/database";
import type { Set, Workout } from "../db/schema";

export interface HeatmapDay {
  date: number;
  workoutCount: number;
  volume: number;
  intensityLevel: 0 | 1 | 2 | 3 | 4;
}

export interface HeatmapGrid {
  startDate: number;
  endDate: number;
  weeks: Date[][];
  days: HeatmapDay[];
  totals: {
    workouts: number;
    volume: number;
  };
}

const DAY_MS = 86_400_000;
const WEEKS = 52;

function startOfDay(ts: number): number {
  return Math.floor(ts / DAY_MS) * DAY_MS;
}

function levelForVolume(volume: number, maxVolume: number): HeatmapDay["intensityLevel"] {
  if (volume <= 0) return 0;
  if (maxVolume <= 0) return 4;
  const ratio = volume / maxVolume;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

export class HeatmapService {
  constructor(private readonly db: Database) {}

  async build(now = Date.now()): Promise<HeatmapGrid> {
    const workouts = await this.db.findAll<Workout>("workout");
    const sets = await this.db.findAll<Set>("set");

    const volumeByDay = new Map<number, number>();
    const countByDay = new Map<number, number>();

    for (const workout of workouts) {
      const day = startOfDay(workout.startedAt);
      countByDay.set(day, (countByDay.get(day) ?? 0) + 1);
      const daySets = sets.filter((s) => s.workoutId === workout.id && !s.isWarmup);
      const volume = daySets.reduce((sum, s) => sum + s.weight * s.reps, 0);
      volumeByDay.set(day, (volumeByDay.get(day) ?? 0) + volume);
    }

    const end = startOfDay(now);
    const start = end - (WEEKS - 1) * 7 * DAY_MS;

    const days: HeatmapDay[] = [];
    for (let ts = start; ts <= end; ts += DAY_MS) {
      days.push({
        date: ts,
        workoutCount: countByDay.get(ts) ?? 0,
        volume: volumeByDay.get(ts) ?? 0,
        intensityLevel: 0,
      });
    }

    const volumes = [...volumeByDay.values()];
    const maxVolume = volumes.length > 0 ? Math.max(...volumes) : 0;
    for (const day of days) {
      day.intensityLevel = levelForVolume(day.volume, maxVolume);
    }

    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7).map((d) => new Date(d.date)));
    }

    return {
      startDate: start,
      endDate: end,
      weeks,
      days,
      totals: {
        workouts: workouts.length,
        volume: [...volumeByDay.values()].reduce((a, b) => a + b, 0),
      },
    };
  }
}
