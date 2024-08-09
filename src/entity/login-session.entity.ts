import { IsDate } from "class-validator"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import ExtendedBaseEntity from "./extended-base.entity"

@Entity({ name: "login_session_tbl" })
class LoginSession extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ length: 50, name: "device_type" })
  deviceType: string

  @Column({ length: 100, name: "device_name" })
  deviceName: string

  @Column({ length: 100 })
  browser: string

  @Column({ length: 100, name: "os_name" })
  os: string

  @Column({ length: 45, name: "ip_address" })
  ipAddress: string

  @Column({ length: 100 })
  country: string

  @Column({ length: 100 })
  city: string

  @Column({ scale: 8 })
  lat: number

  @Column({ scale: 8 })
  long: number

  @Column({ name: "login_at", type: "timestamp" })
  @IsDate()
  loginAt: Date
}

export default LoginSession
