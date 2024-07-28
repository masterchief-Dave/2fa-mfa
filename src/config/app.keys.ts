import "dotenv/config"

export interface IEnv {
  PORT: number
  API_VERSION: string
  API_PATH: string
  ENVIRONMENT: string
  ALLOWED_ORIGINS: string[]
  DATABASE_URL: string
  DATABASE_HOST: string
  DATABASE_PASSWORD: string
  DATABASE_USER: string
  DATABASE_DB: string
  JWT_SECRET: string
  JWT_EXPIRY: string
  IP_API_TOKEN: string
}

const Env: IEnv = {
  PORT: Number(process.env.PORT),
  API_VERSION: process.env.API_VERSION as string,
  API_PATH: "/api/" + process.env.API_VERSION,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(",") as string[],
  ENVIRONMENT: process.env.ENVIRONMENT as string,
  DATABASE_DB: process.env.DATABASE_DB as string,
  DATABASE_HOST: process.env.DATABASE_HOST as string,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD as string,
  DATABASE_URL: process.env.DATABASE_URL as string,
  DATABASE_USER: process.env.DATABASE_USER as string,
  JWT_EXPIRY: process.env.JWT_EXPIRY as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  IP_API_TOKEN: process.env.IP_API_TOKEN as string,
}

export default Env
