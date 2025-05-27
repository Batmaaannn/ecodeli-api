import { config } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  synchronize: process.env.DB_TYPEORM_SYNCHRONIZE ? true : false, // do not set it true in production application
} as DataSourceOptions & SeederOptions);
