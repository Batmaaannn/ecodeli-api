import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";
import * as fs from "fs";
import * as fastcsv from "fast-csv";
import { Prestation } from "src/modules/prestations/entities/prestations.entity";

export default class UserCsvSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const PRESTATIONS_FILE = "prestations.csv";

    let fullPath: string;

    const repo = dataSource.getRepository(Prestation);
    const prestations: Prestation[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream("src/seeds/users.csv")
        .pipe(fastcsv.parse({ headers: true }))
        .on("data", (row) => {
          const user = repo.create({
            name: row.name,
            email: row.email,
            // adapte selon ton CSV
          });
          users.push(user);
        })
        .on("end", async () => {
          await repo.save(users);
          console.log("✅ Prestations insérées depuis CSV");
          resolve();
        })
        .on("error", reject);
    });
  }
}
