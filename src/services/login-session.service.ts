import { Repository } from "typeorm"
import AppDataSource from "../data-source"
import LoginSession from "../entity/login-session.entity"

class LoginSessionService {
  private loginSessionRepository: Repository<LoginSession>
  constructor() {
    this.loginSessionRepository = AppDataSource.getRepository(LoginSession)
  }

  public async getSessionById(id: string) {
    const loginSession = await this.loginSessionRepository.findOne({
      where: { id },
      relations: ["user"],
    })

    return loginSession
  }
}

export default LoginSessionService
