import { Request, Response } from "express"
import APP_CONSTANTS from "../config/app.constants"
import { BAD_REQUEST } from "../extensions/utils/error-response-message.utils"
import AuthService from "../services/auth.service"
import { ISignUp } from "../types/request/request.type"
import BaseApiController from "./base-controllers/base-api.controller"

class AuthController extends BaseApiController {
  authService: AuthService
  constructor() {
    super()
    this.initializeServices()
    this.signup = this.signup.bind(this)
  }
  protected initializeServices(): void {
    this.authService = new AuthService()
  }
  protected initializeMiddleware(): void {
    // throw new Error("Method not implemented.")
  }
  protected initializeRoutes(): void {
    // throw new Error("Method not implemented.")
  }

  async signup(req: Request, res: Response) {
    try {
      const user_request_body: ISignUp = req.body
      // pass the request to the service
      const { user, session } = await this.authService.signup(
        user_request_body,
        req,
        res
      )

      console.log({ user, session })

      // send welcome email to the user
      const welcome_email_response =
        await this.authService.sendWelcomeMailToUser(user_request_body.email)
      if (welcome_email_response !== APP_CONSTANTS.EMAIL_SENT) {
        // throw error
      }
      // send login-info to the user as well
      const login_alert_response = await this.authService.sendLoginAlertToUser(
        user_request_body.email,
        session.id
      )
      if (login_alert_response !== APP_CONSTANTS.EMAIL_SENT) {
        // throw error
      }
      res.end()
    } catch (error) {
      this.sendErrorResponse(res, error, BAD_REQUEST, 400, {})
    }
  }

  async getWelcome(req: Request, res: Response) {
    try {
      const email = "bodunrindavidbond@gmail.com"
      await this.authService.sendWelcomeMailToUser(email)
    } catch (error) {
      this.sendErrorResponse(res, error, BAD_REQUEST, 400, {})
    }
  }
}

export default AuthController
