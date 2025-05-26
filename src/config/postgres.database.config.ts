import { ConfigService } from "@nestjs/config";
import { User } from "src/modules/users/entities/user.entity";
import { DataSourceOptions } from "typeorm";

export const postgresDataSourceConfig = (
  configService: ConfigService
): DataSourceOptions => ({
  type: "postgres",
  host: configService.get<string>("postgres_database.host"),
  port: configService.get<number>("postgres_database.port"),
  username: configService.get<string>("postgres_database.username"),
  password: configService.get<string>("postgres_database.password"),
  database: configService.get<string>("postgres_database.name"),
  synchronize: false,
  entities: [User],
});
