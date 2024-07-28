import bcrypt from "bcryptjs"
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsString,
  MinLength,
} from "class-validator"
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm"
import ExtendedBaseEntity from "./extended-base.entity"

@Entity("user_tbl")
class User extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50 })
  @IsString()
  @MinLength(2)
  firstName: string

  @Column({ length: 50 })
  @IsString()
  @MinLength(2)
  lastName: string

  @Column({ unique: true })
  @IsEmail()
  email: string

  @Column()
  @MinLength(8)
  password: string

  @Column({ nullable: true })
  photo: string

  @Column({ default: false })
  @IsBoolean()
  isEmailVerified: boolean

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean

  @Column({ nullable: true, type: "timestamp" })
  @IsDate()
  lastLoginAt: Date

  @Column({ default: "active", length: 20 })
  accountStatus: string

  @Column({ nullable: true })
  passwordResetToken: string

  @Column({ nullable: true, type: "timestamp" })
  passwordResetExpires: Date

  @Column({ nullable: true })
  twoFactorSecret: string

  @Column({ nullable: true })
  token: string

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt()
      this.password = await bcrypt.hash(this.password, salt)
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }

  toJSON() {
    const { password, ...user } = this
    return user
  }
}

export default User
