import Env from "./app.keys"

const joiValidatorOptions = {
  errors: {
    wrap: {
      label: "",
    },
  },
  stripUnknown: true,
  abortEarly: false,
  allowUnknown: false,
}

const ENVIRONMENTS = Object.freeze({
  PROD: "production",
  DEV: "development",
  UAT: "user acceptance testing",
  STAGING: "staging",
})

const QUEUE_CONFIG = Object.freeze({
  host: Env.REDIS_HOST,
  port: parseInt(Env.REDIS_PORT || "6379"),
  retries: 3,
  delay: 1000 * 60 * 5,
})

export { ENVIRONMENTS, QUEUE_CONFIG, joiValidatorOptions }
