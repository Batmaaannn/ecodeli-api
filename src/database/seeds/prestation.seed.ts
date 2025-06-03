import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";
import * as fs from "fs";
import * as fastcsv from "fast-csv";

import { Prestation } from "src/modules/prestations/entities/prestations.entity";
import path from "path";

export default class PrestationsCsvSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Prestation);
    const prestations = [];

    const filePath = path.resolve(__dirname, "./data/prestations.csv"); // adapte selon ton arborescence
    console.log("📂 Lecture fichier :", fs.existsSync(filePath)); // true ou false

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(
          fastcsv.parse({
            headers: ["category", "prestation"],
            delimiter: ";",
          })
        )
        .on("data", (row) => {
          if (row.category && row.prestation) {
            console.log("📥 Ligne lue :", row);
            const prestation = repo.create({
              label: row.prestation ? row.prestation.trim() : "",
              category: row.category ? row.category.trim() : "",
            });
            prestations.push(prestation);
          } else {
            console.warn("⚠️ Ligne ignorée :", row);
          }
        })
        .on("end", async () => {
          if (prestations.length > 0) {
            await repo.save(prestations);
          }
          console.log("✅ Prestations insérées depuis CSV");
          resolve();
        })
        .on("error", reject);
    });
  }
}
