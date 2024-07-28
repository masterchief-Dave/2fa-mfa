"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var Env = {
    PORT: Number(process.env.PORT),
    API_VERSION: process.env.API_VERSION,
    API_PATH: "/api/" + process.env.API_VERSION,
    ALLOWED_ORIGINS: (_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(","),
    ENVIRONMENT: process.env.ENVIRONMENT,
    DATABASE_DB: process.env.DATABASE_DB,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_USER: process.env.DATABASE_USER,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    JWT_SECRET: process.env.JWT_SECRET,
    IP_API_TOKEN: process.env.IP_API_TOKEN,
};
exports.default = Env;
