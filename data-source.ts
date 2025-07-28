import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import * as dotenv from "dotenv";
dotenv.config();

const options: DataSourceOptions & SeederOptions = {
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "ecodeli",
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  synchronize: true, // ⚠️ ne pas laisser true en production
  seeds: [__dirname + "/**/*.seed.ts"],
  factories: [__dirname + "/**/*.factory{.ts,.js}"],
  seedTracking: false,
};

export const dataSource = new DataSource(options);
