import { Request, Response } from "express"
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
      const userRequestBody: ISignUp = req.body
      // pass the request to the service
      const response = await this.authService.signup(userRequestBody, req, res)

      // console.log({ response })
      res.end()
    } catch (error) {
      this.sendErrorResponse(res, error, BAD_REQUEST, 400, {})
    }
  }
}

export default AuthController
