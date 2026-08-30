import type { Row, TableName } from "./database";

export function getEmptyCollectionsState(): Record<TableName, Array<Row & { id: string }>> {
  return {
    exercise: [],
    routine: [],
    workout: [],
    set: [],
  } as Record<TableName, Array<Row & { id: string }>>;
}
