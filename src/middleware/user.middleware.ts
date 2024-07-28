import { NextFunction, Request, Response, Router } from "express"
import APP_CONSTANTS from "../config/app.constants"
import AppDataSource from "../data-source"
import User from "../entity/user.entity"
import {
  BAD_REQUEST,
  requiredField,
  UNABLE_TO_COMPLETE_REQUEST,
} from "../extensions/utils/error-response-message.utils"
import AuthService from "../services/auth.service"
import BaseRouterMiddleware from "./base-middleware/base-middleware"

class UserMiddleware extends BaseRouterMiddleware {
  authService: AuthService
  constructor(appRouter: Router) {
    super(appRouter)
    this.authService = new AuthService()
  }

  public hashNewPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userPassword = await this.authService.hashData(req.body.password)
      req.body.password = userPassword
      next()
    } catch (error: any) {
      this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500)
    }
  }

  // load the user from the db and attach the user to the request body
  public loadUserToRequestBodyByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const email = req.body.email
    if (!email) {
      const error = new Error("Email is required")
      return this.sendErrorResponse(res, error, requiredField("email"), 400)
    }

    // TODO
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({ email: email })
    if (!user)
      return this.sendErrorResponse(
        res,
        new Error("Authentication Failed"),
        BAD_REQUEST,
        401
      )

    // attach the user to the request object
    this.requestUtils.addDataToState(APP_CONSTANTS.USER_LABEL, user)
    this.requestUtils.addDataToState(
      APP_CONSTANTS.USER_PASSWORD_LABEL,
      user.password
    )
    next()
  }
}

export default UserMiddleware
