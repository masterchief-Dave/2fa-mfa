import { Response } from "express"
import HTTP_STATUS_CODE from "../../extensions/utils/http-status-code"
import logger from "../../extensions/utils/logger"
import { IResponseMessage } from "../../types/response/response.types"

abstract class BaseResponseHandler {
  protected async sendErrorResponse(
    res: Response,
    err: Error,
    responseMessage: IResponseMessage,
    statusCode: number,
    data?: Record<string, any>
  ) {
    const response = {
      status: HTTP_STATUS_CODE[statusCode as keyof typeof HTTP_STATUS_CODE],
      message: responseMessage.message,
      statusCode: statusCode,
      data,
    }

    if (statusCode === 500)
      logger.error(response.message, "\n" + res, "\n" + err)

    res.status(statusCode).json(response)
  }

  protected async sendSuccessResponse(
    res: Response,
    message: string,
    data: any = null,
    statusCode: number = 200
  ) {
    const response = {
      status: HTTP_STATUS_CODE[statusCode as keyof typeof HTTP_STATUS_CODE],
      // statusCode: statusCode,
      message: message,
      data,
    }
    res.status(statusCode).json(response)
  }
}

export default BaseResponseHandler
