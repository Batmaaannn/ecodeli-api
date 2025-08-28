import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";

import { importPrestations } from "../setup";
import { importWarehouses } from "../setup/warehouse";

export default class Setup implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const prestations = await dataSource.manager.find("prestations");
    const warehouseStorages = await dataSource.manager.find("warehouses");

    if (prestations.length < 1) {
      await importPrestations(dataSource);
      console.log("\n ✅ Prestations Imported");
    }

    if (warehouseStorages.length < 1) {
      await importWarehouses(dataSource);
      console.log("\n ✅ Warehouses Imported");
    }
  }
}
