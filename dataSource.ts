import { DataSource } from "typeorm";
import { Users } from "./src/entity";
import dotenv = require("dotenv");

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  entities: [Users],
  synchronize: true,
  logging: false,
  migrations: ["migrations/1674802802470-PostRefactoring.ts"],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
