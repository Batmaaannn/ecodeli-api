import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";

import { importPrestations } from "../setup";

export default class Setup implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const prestations = await dataSource.manager.find("prestations");

    console.log("\n 🏁 Setup Seed", prestations);

    if (prestations.length < 1) {
      await importPrestations(dataSource);
      console.log("\n ✅ Prestations Imported");
    }
  }
}
