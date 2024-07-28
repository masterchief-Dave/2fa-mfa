import { Router } from "express"
import AuthController from "../controllers/auth.controller"
import AppValidator from "../middleware/app-validator.middleware"
import UserMiddleware from "../middleware/user.middleware"

class AuthRouter {
  router: Router
  authController: AuthController
  appValidator: AppValidator
  userMiddleware: UserMiddleware
  constructor() {
    this.router = Router()
    this.authController = new AuthController()
    this.appValidator = new AppValidator(this.router)
    this.userMiddleware = new UserMiddleware(this.router)
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.post(
      "/register",
      this.appValidator.validateUserSignup,
      this.userMiddleware.hashNewPassword,
      this.authController.signup
    )
  }
}

export default AuthRouter
