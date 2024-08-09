import Bull, { Job } from "bull"
import { QUEUE_CONFIG } from "../config/app.config"
import APP_CONSTANTS from "../config/app.constants"
import logger from "../extensions/utils/logger"
import { Sendmail } from "../extensions/utils/mail"

interface EmailData {
  from: string
  to: string
  subject: string
  html: string
}

const emailQueue = new Bull("Email", {
  redis: {
    host: QUEUE_CONFIG.host,
    port: QUEUE_CONFIG.port || parseInt("6379"),
  },
})

const addEmailToQueue = async (data: EmailData): Promise<string> => {
  try {
    await emailQueue.add(data, {
      attempts: QUEUE_CONFIG.retries,
      backoff: {
        type: "fixed",
        delay: QUEUE_CONFIG.delay,
      },
    })
    return APP_CONSTANTS.EMAIL_SENT
  } catch (error) {
    return APP_CONSTANTS.EMAIL_NOT_SENT
  }
}
emailQueue.process(async (job: Job, done) => {
  try {
    await Sendmail(job.data)
    job.log(APP_CONSTANTS.EMAIL_SENT + " to " + job.data.to)
    logger.info("Email sent successfully")
  } catch (error) {
    logger.error("Error sending email:", error)
  } finally {
    done()
  }
})

const handleJobCompletion = (queue: Bull.Queue, type: string) => {
  queue.on("completed", (job: Job) => {
    logger.info(`${type} Job with id ${job.id} has been completed`)
  })

  queue.on("failed", (job: Job, error: Error) => {
    logger.error(
      `${type} Job with id ${job.id} has failed with some error: ${error.message}`
    )
  })
}

handleJobCompletion(emailQueue, "Email")

export { addEmailToQueue, emailQueue }
