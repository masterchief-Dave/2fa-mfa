import "dotenv/config"
import Nodemailer from "nodemailer"
import Env from "../../config/app.keys"
import logger from "./logger"

const Sendmail = async (emailContent: any) => {
  // const transport = Nodemailer.createTransport(
  //   MailtrapTransport({
  //     token: "2f9daadd811bdb482af7bb3044a3a8ea",
  //   })
  // )

  const transport = Nodemailer.createTransport({
    // service: Env.SMTP_HOST,
    host: Env.SMTP_HOST,
    port: 2525,
    auth: {
      user: Env.SMTP_USER,
      pass: Env.SMTP_PASS,
    },
  })
  try {
    await transport.sendMail(emailContent)
    return "Email sent."
  } catch (error) {
    logger.error(error)
    throw error
  }
}

export { Sendmail }
