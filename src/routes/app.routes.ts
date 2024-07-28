import { Express } from "express"
import Env from "../config/app.keys"
import AuthRouter from "./auth.route"

class AppRoutes {
  app: Express
  authRouter: AuthRouter
  constructor(app: Express) {
    this.app = app
    this.authRouter = new AuthRouter()
  }

  initializeRoutes() {
    const authPath = Env.API_PATH + "/auth"
    /**
     *  this.app.use(Env.API_PATH + "/users", this.userController.router)
    this.app.use(
      Env.API_PATH + "/organisations",
      this.organizationController.router
    )
     */

    this.app.use(authPath, this.authRouter.router)
  }
}

export default AppRoutes
