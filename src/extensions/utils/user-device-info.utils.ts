import axios from "axios"
import { Request, Response } from "express"
import { getClientIp } from "request-ip"
import UAParser from "ua-parser-js"
import Env from "../../config/app.keys"
import logger from "./logger"

interface IUserInfo {
  browser: string | undefined
  os: string | undefined
  deviceType: string | undefined
  deviceName: string | undefined
  ipAddress: string | null
  country: string
  city: string
  lat: string
  long: string
}

class UserDeviceInfo implements IUserInfo {
  ipAddress: string
  parser: UAParser
  req: Request
  res: Response
  city: string = ""
  country: string = ""
  browser: string = ""
  deviceName: string = ""
  deviceType: string = ""
  lat: string = ""
  long: string = ""
  os: string = ""

  constructor(req: Request, res: Response) {
    this.req = req

    this.parser = new UAParser(req.headers["user-agent"])
    this.ipAddress = String(getClientIp(req))
    console.log("this.parser", this.parser)
    logger.info("Constructor called")
    logger.info({ headers: req.headers }, "Request headers")

    const userAgent = req.headers["user-agent"] || req.get("User-Agent") || ""
    logger.info({ userAgent }, "User Agent")

    this.setBrowser()
    this.setOs()
    this.setDeviceType()
    this.setDeviceName()
  }

  setBrowser() {
    this.browser = this.parser.getBrowser().name || ""
  }

  setOs() {
    this.os = this.parser.getOS().name || ""
  }

  setDeviceType() {
    this.deviceType = this.parser.getDevice().type || ""
  }

  setDeviceName() {
    this.deviceName = this.parser.getDevice().model || ""
  }

  getIpAddress() {
    return this.ipAddress
  }

  setLocalHostInfo() {
    this.city = "Localhost"
    this.country = "Localhost"
    this.lat = "0"
    this.long = "0"
  }

  async locationFromIpAddress(ip: string) {
    console.log("console.log(this.parser)", this.parser)
    const PROD_URL = `https://ipinfo.io/${ip}/json?token=${Env.IP_API_TOKEN}`
    const DEV_URL = ``
    let url = Env.ENVIRONMENT === "development" ? DEV_URL : PROD_URL
    if (ip === "::1" || ip === "127.0.0.1" || ip === "undefined") {
      logger.info("Client is running on Localhost")
      this.setLocalHostInfo()
      return
    }
    try {
      const response = await axios.get(url)

      this.city = response.data.city || "Unknown"
      this.country = response.data.country || "Unknown"
      this.lat = response.data.loc.split(",")[0]
      this.long = response.data.loc.split(",")[1]
    } catch (error) {
      console.error("Error fetching location data:", error)
    }
  }

  async info(): Promise<IUserInfo> {
    logger.info("calling the parser", this.parser)
    console.log("this.parser", this.parser)
    await this.locationFromIpAddress(this.ipAddress)

    // console.log(
    //   "info-object",
    //   this.browser,
    //   this.os,
    //   this.deviceName,
    //   this.deviceType,
    //   this.country
    // )

    return {
      browser: this.browser,
      os: this.os,
      deviceType: this.deviceType,
      deviceName: this.deviceName,
      ipAddress: this.ipAddress,
      country: this.country,
      city: this.city,
      lat: this.lat,
      long: this.long,
    }
  }
}

export default UserDeviceInfo
