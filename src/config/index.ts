import { Environments } from "src/types/environments";

export default {
  environment: process.env.NODE_ENV || Environments.DEV,
  jwtSecret: process.env.JWT_SECRET || "ecodeli",
  postgres_database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  typeorm: {
    type: process.env.DB_TYPEORM_TYPE || "postgres",
    synchronize: process.env.DB_TYPEORM_SYNCHRONIZE === "true" ? true : false,
  },
  storage: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretKey: process.env.S3_SECRET_KEY || "",
    host: process.env.S3_HOST || "",
    region: process.env.S3_REGION || "eu-west-3",
    fileUrlExpiration: Number(process.env.SIGNED_URL_EXPIRES_SECONDS) || 900, // 15minutes
  },
};
