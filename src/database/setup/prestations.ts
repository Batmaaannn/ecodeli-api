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
          headers: ["category", "prestation"],
          delimiter: ";",
        })
        .transform((data: { category: string; prestation: string }) => ({
          category: data.category.trim(),
          label: data.prestation.trim(),
        }))
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
