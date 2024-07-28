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

class AuthService {
  userRepository: Repository<User>
  loginSessionRepository: Repository<LoginSession>
  userDeviceInfo: UserDeviceInfo
  constructor() {
    this.userRepository = AppDataSource.getRepository(User)
    this.loginSessionRepository = AppDataSource.getRepository(LoginSession)
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
      const userDeviceInfo = new UserDeviceInfo(req, res)
      console.log("the code is here at the moment", { userDeviceInfo })
      console.log("use-device-info", await this.userDeviceInfo.info())
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
      console.log("info-breakdown", browser, city, country, deviceName)
      // console.log("specific-device-info", this.userDeviceInfo.city)
      // console.log("user-device-info-browser", this.userDeviceInfo.browser)
      loginSession.deviceName = deviceName
      loginSession.deviceType = deviceType
      loginSession.browser = browser
      loginSession.city = city
      loginSession.country = country
      loginSession.ipAddress = ipAddress
      loginSession.lat = Number(lat)
      loginSession.long = Number(long)
      loginSession.loginAt = new Date(new Date().getDate())
      // const session = await this.loginSessionRepository.save(loginSession)
      // return session
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
      console.log("User-Agent", res.locals.ua)
      const session = this.createDeviceLoginInfo(req, res, newLoginSession)
      logger.info({ session })
      logger.info("User session created")

      const user = await this.userRepository.save(newUser)

      return user
    } catch (error) {
      logger.error(error)
    }
  }

  static async login() {}
}

export default AuthService
