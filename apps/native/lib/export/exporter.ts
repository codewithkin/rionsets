import type { Database } from "../db/database";
import { CsvExportService } from "./csv-export";
import { JsonExportService } from "./json-export";

export interface ExportArtifact {
  filename: string;
  mimeType: string;
  content: string;
}

export interface ShareTarget {
  save(artifact: ExportArtifact): Promise<void>;
}

export async function saveArtifact(target: ShareTarget, artifact: ExportArtifact): Promise<void> {
  await target.save(artifact);
}

export class Exporter {
  private readonly csv: CsvExportService;
  private readonly json: JsonExportService;

  constructor(private readonly db: Database) {
    this.csv = new CsvExportService(db);
    this.json = new JsonExportService(db);
  }

  async exportCsvArtifacts(): Promise<ExportArtifact[]> {
    const all = await this.csv.all();
    return [
      { filename: "iron-sets-exercises.csv", mimeType: "text/csv", content: all.exercises },
      { filename: "iron-sets-workouts.csv", mimeType: "text/csv", content: all.workouts },
      { filename: "iron-sets-sets.csv", mimeType: "text/csv", content: all.sets },
      { filename: "iron-sets-routines.csv", mimeType: "text/csv", content: all.routines },
    ];
  }

  async exportJsonArtifact(): Promise<ExportArtifact> {
    return {
      filename: "iron-sets-export.json",
      mimeType: "application/json",
      content: await this.json.export(),
    };
  }

  async exportAll(): Promise<ExportArtifact[]> {
    return [...(await this.exportCsvArtifacts()), await this.exportJsonArtifact()];
  }
}
