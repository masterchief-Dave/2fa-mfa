import express, { Express } from "express"
import { ENVIRONMENTS } from "./config/app.config"
import Env from "./config/app.keys"
import AppDataSource from "./data-source"
import logger from "./extensions/utils/logger"
import AppRoutes from "./routes/app.routes"

class App {
  public app: Express
  private appRoutes: AppRoutes
  constructor() {
    this.app = express()
    this.appRoutes = new AppRoutes(this.app)
    this.pluginMiddlewares()
    this.plugInRoutes()
  }

  private pluginMiddlewares() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(function (req, res, next) {
      res.locals.ua = req.get("User-Agent")
      next()
    })
  }

  private plugInRoutes() {
    this.app.get("/", (_req, res) => {
      res.status(200).send("<h1>Successful</h1>")
    })
    this.app.get(Env.API_PATH + "/health", (req, res) => {
      const response = "Server is health___  " + new Date().toUTCString()
      res.status(200).send(response)
    })

    // this.app.use("/api/v1/auth", new AuthController().router)
    this.appRoutes.initializeRoutes()
    this.app.all("*", (_req, res) => {
      res.status(404).send("RESOURCE NOT FOUND")
    })
  }
}

AppDataSource.initialize()
  .then(() => logger.info("Connection to the DB established"))
  .then(() => {
    new App().app.listen(Env.PORT, () => {
      if (Env.ENVIRONMENT === ENVIRONMENTS.DEV) {
        logger.info(
          `Express is listening on http://localhost:${Env.PORT}${Env.API_PATH}`
        )
      }
    })
  })
  .catch((error) => {
    logger.error("Error connecting to the DB")
    console.log(error)
  })
