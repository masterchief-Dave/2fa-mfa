import bcrypt from "bcryptjs"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { Repository } from "typeorm"
import Env from "../config/app.keys"
import AppDataSource from "../data-source"
import LoginSession from "../entity/login-session.entity"
import User from "../entity/user.entity"
import logger from "../extensions/utils/logger"
import UserDeviceInfo from "../extensions/utils/user-device-info.utils"
import { ISignUp } from "../types/request/request.type"
import { IJwtPayload } from "../types/response/response.types"
import EmailService from "./email.service"
import RequestUtils from "./request.service"

class AuthService {
  userRepository: Repository<User>
  loginSessionRepository: Repository<LoginSession>
  userDeviceInfo: UserDeviceInfo
  emailService: EmailService
  requestUtils: RequestUtils
  constructor() {
    this.userRepository = AppDataSource.getRepository(User)
    this.loginSessionRepository = AppDataSource.getRepository(LoginSession)
    this.emailService = new EmailService()

    // this.userDeviceInfo = new UserDeviceInfo()
  }

  async hashData(data: string, rounds = 12): Promise<string> {
    const salt = await bcrypt.genSalt(rounds)
    return bcrypt.hash(data, salt)
  }

  async createAuthToken(userId: string) {
    try {
      return jwt.sign({ data: userId }, Env.JWT_SECRET, {
        expiresIn: Env.JWT_EXPIRY,
      })
    } catch (error: any) {
      throw error
    }
  }

  async validateHashedData(
    value: string,
    hashedData: string
  ): Promise<boolean> {
    return await bcrypt.compare(value, hashedData)
  }

  async getTokenFromRequest(req: Request) {
    let jwt = ""
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer") &&
      req.headers.authorization.split(" ").length > 1
    ) {
      jwt = req.headers.authorization.split(" ")[1]
    }

    return jwt
  }

  async verifyJwtToken(token: string): Promise<IJwtPayload> {
    let decoded = null
    try {
      decoded = (await jwt.verify(token, Env.JWT_SECRET)) as IJwtPayload

      // if (!decoded) {
      //   throw new Error("Invalid Token")
      // }
      return decoded
    } catch (err) {
      throw err
    }
  }

  async createDeviceLoginInfo(
    req: Request,
    res: Response,
    loginSession: LoginSession
  ) {
    try {
      this.userDeviceInfo = new UserDeviceInfo(req, res)
      const {
        browser,
        city,
        country,
        deviceName,
        deviceType,
        ipAddress,
        lat,
        long,
        os,
      } = await this.userDeviceInfo.info()
      loginSession.deviceName = deviceName
      loginSession.deviceType = deviceType
      loginSession.browser = browser
      loginSession.city = city
      loginSession.country = country
      loginSession.ipAddress = ipAddress
      loginSession.lat = Number(lat)
      loginSession.long = Number(long)
      loginSession.loginAt = new Date(new Date().getDate())
      loginSession.os = os
      const session = await this.loginSessionRepository.save(loginSession)
      return session
    } catch (error) {
      logger.error(error)
      throw error
    }
  }

  async signup(userRequestBody: ISignUp, req: Request, res: Response) {
    try {
      // add the user to the DB
      const newUser = new User()
      newUser.email = userRequestBody.email
      newUser.firstName = userRequestBody.firstName
      newUser.lastName = userRequestBody.lastName
      newUser.password = userRequestBody.password
      newUser.isEmailVerified = false
      newUser.isActive = false
      newUser.lastLoginAt = new Date(new Date().getDate())

      // create login session history
      const newLoginSession = new LoginSession()
      const userSession = await this.createDeviceLoginInfo(
        req,
        res,
        newLoginSession
      )

      const user = await this.userRepository.save(newUser)
      const session = await this.loginSessionRepository.save(userSession)

      return { user, session }
    } catch (error) {
      throw error
    }
  }

  static async login() {}

  async sendWelcomeMailToUser(email: string) {
    try {
      // return await Sendmail(welcomeTemplate)
      // I want to move the login session of this user to the email service so thay the login information will show
      return this.emailService.sendWelcomeMail(email)
    } catch (error) {
      throw error
    }
  }

  async sendLoginAlertToUser(email: string, session_id: string) {
    try {
      return this.emailService.sendLoginAlertMail(email, session_id)
    } catch (error) {
      throw error
    }
  }
}

export default AuthService
