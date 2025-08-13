import { Prestation } from "src/modules/prestations/entities/prestations.entity";
import { DataSource } from "typeorm";
import * as fastcsv from "fast-csv";
import * as fs from "fs";

export const importPrestations = async (dataSource: DataSource) => {
  const PRESTATIONS_FILE = "prestations.csv";

  let fullPath: string | undefined;

  const prestationsArray: Prestation[] = await new Promise(
    async (resolve, reject) => {
      const results: Prestation[] = [];

      if (fs.existsSync(`src/data/${PRESTATIONS_FILE}`)) {
        fullPath = `src/data/${PRESTATIONS_FILE}`;
      } else {
        return reject(
          new Error(`[Prestations] - File not found: ${PRESTATIONS_FILE}`)
        );
      }

      fastcsv
        .parseFile(fullPath, {
          headers: [
            "category",
            "label",
            "ecodeli_price",
            "pricing_unit",
            "description",
          ],
          delimiter: ";",
        })
        .transform(
          (data: {
            category: string;
            label: string;
            ecodeli_price: string;
            pricing_unit: string;
            description: string;
          }) => ({
            category: data.category.trim(),
            label: data.label.trim(),
            ecodeli_price: parseFloat(data.ecodeli_price.trim()) || 0,
            pricing_unit: data.pricing_unit.trim(),
            description: data.description.trim(),
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
          console.log("[Prestations] - End of parsing CSV");
          return resolve(results);
        });
    }
  );

  await dataSource
    .createQueryBuilder()
    .insert()
    .into(Prestation)
    .values(prestationsArray)
    .execute();

  // if (!fs.existsSync(`./data/${PRESTATIONS_FILE}`))
  //   fs.unlink(fullPath, () => {
  //     console.log(`${PRESTATIONS_FILE} - File removed with success`);
  //   });
};
