export type SetType = "warmup" | "working" | "heavy" | "drop" | "failure";

export type RestTimerStatus = "idle" | "running" | "paused" | "completed";

export interface RestTimerConfig {
  defaults: Record<SetType, number>;
}

export const DEFAULT_REST_CONFIG: RestTimerConfig = {
  defaults: {
    warmup: 60,
    working: 90,
    heavy: 180,
    drop: 120,
    failure: 180,
  },
};

export interface RestTimerState {
  status: RestTimerStatus;
  remainingMs: number;
  totalMs: number;
  startedAt: number | null;
  pausedAt: number | null;
}

export interface RestTimerAction {
  type:
    | "start"
    | "pause"
    | "resume"
    | "reset"
    | "complete"
    | "tick";
  setType?: SetType;
  durationMs?: number;
  now?: number;
}

export function createIdleTimer(): RestTimerState {
  return {
    status: "idle",
    remainingMs: 0,
    totalMs: 0,
    startedAt: null,
    pausedAt: null,
  };
}

export function durationForSetType(
  setType: SetType,
  config: RestTimerConfig = DEFAULT_REST_CONFIG,
): number {
  return config.defaults[setType];
}

const SECONDS_TO_MS = 1000;

export function restTimerReducer(
  state: RestTimerState,
  action: RestTimerAction,
  config: RestTimerConfig = DEFAULT_REST_CONFIG,
): RestTimerState {
  switch (action.type) {
    case "start": {
      if (state.status === "running") return state;
      const durationMs =
        action.durationMs ??
        durationForSetType(action.setType ?? "working", config) * SECONDS_TO_MS;
      return {
        status: "running",
        remainingMs: durationMs,
        totalMs: durationMs,
        startedAt: action.now ?? null,
        pausedAt: null,
      };
    }
    case "pause": {
      if (state.status !== "running") return state;
      return { ...state, status: "paused", pausedAt: action.now ?? null };
    }
    case "resume": {
      if (state.status !== "paused") return state;
      return { ...state, status: "running", pausedAt: null };
    }
    case "tick": {
      if (state.status !== "running") return state;
      const now = action.now ?? 0;
      const elapsedMs = state.startedAt == null ? 0 : Math.max(0, now - state.startedAt);
      const remainingMs = Math.max(0, state.totalMs - elapsedMs);
      const nextStatus: RestTimerStatus = remainingMs <= 0 ? "completed" : "running";
      return { ...state, remainingMs, status: nextStatus };
    }
    case "complete":
      return { ...state, status: "completed", remainingMs: 0 };
    case "reset":
      return createIdleTimer();
    default:
      return state;
  }
}
