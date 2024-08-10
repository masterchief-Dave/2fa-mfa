import Env from "../config/app.keys"
import { addEmailToQueue } from "../queue"
import renderTemplate from "../views/email/render-templates.views"
import LoginSessionService from "./login-session.service"

class EmailService {
  private loginSessionService: LoginSessionService
  constructor() {
    this.loginSessionService = new LoginSessionService()
  }
  private emailContent(email: string, subject: string, emailTemplate: string) {
    return {
      from: `Boilerplate <${Env.SMTP_USER}>`,
      to: email,
      subject: subject,
      html: emailTemplate,
    }
  }

  async sendOtpMail() {}

  async sendWelcomeMail(email: string) {
    try {
      const emailTemplate = renderTemplate("welcome", {
        title: "Welcome",
      })
      const emailContent = this.emailContent(email, "Greetings", emailTemplate)

      return await addEmailToQueue(emailContent)
      // return await Sendmail(welcomeTemplate)
    } catch (error) {
      throw error
    }
  }

  async sendLoginAlertMail(email: string, session_id: string) {
    try {
      const response = await this.loginSessionService.getSessionById(session_id)
      console.log({ response })
      const emailTemplate = renderTemplate("login-alert", {
        title: "Login Alert",
      })
      const emailContent = this.emailContent(
        email,
        "Login Alert",
        emailTemplate
      )
      return await addEmailToQueue(emailContent)
    } catch (error) {
      throw error
    }
  }
}

export default EmailService
