import { NextFunction, Request, Response, Router } from "express"
import joi from "joi"
import { Repository } from "typeorm"
import { joiValidatorOptions } from "../config/app.config"

import AppDataSource from "../data-source"
import User from "../entity/user.entity"
import {
  badRequestError,
  CLIENT_ERROR,
  DUPLICATE_EMAIL,
} from "../extensions/utils/error-response-message.utils"
import { ISignUp } from "../types/request/request.type"
import BaseRouterMiddleware from "./base-middleware/base-middleware"

class AppValidator extends BaseRouterMiddleware {
  userRepository: Repository<User>
  constructor(appRouter: Router) {
    super(appRouter)
    this.userRepository = AppDataSource.getRepository(User)
  }

  public validateUserSignup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const UserSignupSchema: joi.ObjectSchema<ISignUp> = joi.object({
        firstName: joi.string().max(256).required(),
        lastName: joi.string().max(256).required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
      })

      await UserSignupSchema.validateAsync(req.body, joiValidatorOptions)
      const existingUser = await this.userRepository.findBy({
        email: req.body.email,
      })
      if (existingUser.length >= 1) {
        const error = new Error("A user with this email already exists")
        return this.sendErrorResponse(res, error, DUPLICATE_EMAIL, 422)
      }
      next()
    } catch (error: any) {
      return this.sendErrorResponse(
        res,
        error,
        badRequestError(error.message),
        422
      )
    }
  }

  public validateOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const OrganizationCreateSchema = joi.object({
        name: joi.string().required(),
        description: joi.string().required(),
      })
      await OrganizationCreateSchema.validateAsync(
        req.body,
        joiValidatorOptions
      )
      next()
    } catch (error: any) {
      this.sendErrorResponse(res, new Error("Bad Request"), CLIENT_ERROR, 422)
    }
  }
}

export default AppValidator
