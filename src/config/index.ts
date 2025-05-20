import { Environments } from "src/types/environments";

export default {
  environment: process.env.NODE_ENV || Environments.DEV,
  jwtSecret: process.env.JWT_SECRET || "ecodeli",
  postgres_database: {
    host: process.env.POSTGRES_DB_HOST,
    port: parseInt(process.env.POSTGRES_DB_PORT, 10),
    username: process.env.POSTGRES_DB_USER,
    password: process.env.POSTGRES_DB_PASSWORD,
    name: process.env.POSTGRES_DB_DATABASE,
    ssl: process.env.POSTGRES_DB_SSL_CERT,
  },
};
