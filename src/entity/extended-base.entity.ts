import { validateOrReject } from "class-validator"
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

class ExtendedBaseEntity extends BaseEntity {
  @BeforeInsert()
  async validateOnInsert() {
    await validateOrReject(this)
  }

  @BeforeUpdate()
  async validateOnUpdate() {
    await validateOrReject(this, { skipMissingProperties: true })
  }

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

export default ExtendedBaseEntity
