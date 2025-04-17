import { DataSource } from "typeorm";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.MYHOST,
  port: process.env.MYDBPORT ? parseInt(process.env.MYDBPORT) : 5432,
  password: process.env.MYDBPASSWORD,
  database: process.env.MYDBNAME,
  username: process.env.MYDBUSER,
  entities: [path.join(__dirname, "../entities/*{.ts,.js}")],
  synchronize: true,
  logging: true,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function getConnection() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("Database Initialized");
  }
  return AppDataSource;
}
