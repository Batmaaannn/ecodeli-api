import { DataSource, Point } from "typeorm";
import * as fastcsv from "fast-csv";
import * as fs from "fs";
import { Warehouse } from "src/modules/warehouses/entities/warehouse.entity";

export const importWarehouses = async (dataSource: DataSource) => {
  const WAREHOUSES_FILE = "warehouses.csv";

  let fullPath: string | undefined;

  const warehousesArray: Warehouse[] = await new Promise(
    async (resolve, reject) => {
      const results: Warehouse[] = [];

      if (fs.existsSync(`src/data/${WAREHOUSES_FILE}`)) {
        fullPath = `src/data/${WAREHOUSES_FILE}`;
      } else {
        return reject(
          new Error(`[Warehouses] - File not found: ${WAREHOUSES_FILE}`)
        );
      }

      fastcsv
        .parseFile(fullPath, {
          headers: [
            "label",
            "address",
            "postal_code",
            "city",
            "telephone",
            "latitude",
            "longitude",
          ],
          delimiter: ";",
        })
        .transform(
          (data: {
            label: string;
            address: string;
            postal_code: string;
            city: string;
            telephone: string;
            latitude: string;
            longitude: string;
          }) => ({
            category: data.address.trim(),
            address: data.address.trim(),
            label: data.label.trim(),
            postal_code: data.postal_code.trim(),
            city: data.city.trim(),
            telephone: data.telephone.trim(),
            latitude: data.latitude.trim(),
            longitude: data.longitude.trim(),
          })
        )
        .on("data", (row) => {
          const keys = Object.keys(row);

          keys.forEach((key, index) => {
            if (row[key] === "") {
              row[key] = null;
            }
          });
          results.push(row);
        })
        .on("end", () => {
          console.log("[Warehouses] - End of parsing CSV");
          return resolve(results);
        });
    }
  );

  await dataSource
    .createQueryBuilder()
    .insert()
    .into(Warehouse)
    .values(warehousesArray)
    .execute();

  // if (!fs.existsSync(`./data/${PRESTATIONS_FILE}`))
  //   fs.unlink(fullPath, () => {
  //     console.log(`${PRESTATIONS_FILE} - File removed with success`);
  //   });
};
