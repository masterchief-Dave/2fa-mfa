import { Request } from "express"
import { UAParser } from "ua-parser-js"

const mockRequest = {
  headers: {
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
} as unknown as Request

// const userDeviceInfo = new UserDeviceInfo(mockRequest)
// const info = userDeviceInfo.info().then((data) => console.log({ data }))
// console.log("use-device-info", info)
function getDeviceInfo() {
  const deviceName = new UAParser()
  console.log(deviceName.getBrowser())
  console.log(deviceName.getDevice())
  console.log(deviceName.getOS())
  console.log({ deviceName })
}

getDeviceInfo()
