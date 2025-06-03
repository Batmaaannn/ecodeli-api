import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";

console.log("Initializing data source configuration...");
const options: DataSourceOptions & SeederOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "postgres",
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  synchronize: true, // do not set it true in production application
  seeds: [__dirname + "/**/*.seed{.ts,.js}"],
  seedTracking: false,
};

export const dataSource = new DataSource(options);
