import "reflect-metadata"
import { DataSource } from "typeorm"
import Env from "./config/app.keys"
import LoginSession from "./entity/login-session.entity"
import User from "./entity/user.entity"

const AppDataSource = new DataSource({
  type: "postgres",
  host: Env.DATABASE_HOST,
  port: 5432,
  username: Env.DATABASE_USER,
  password: Env.DATABASE_PASSWORD,
  database: "mfa",
  synchronize: true,
  logging: false,
  entities: [User, LoginSession],
})

export async function initializeDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
  }
  return AppDataSource
}

export default AppDataSource
