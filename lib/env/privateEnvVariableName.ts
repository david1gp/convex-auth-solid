export type PrivateEnvVariableName = keyof typeof privateEnvVariableName

export const privateEnvVariableName = {
  // mode
  ENV_MODE: "ENV_MODE",
  NODE_ENV: "NODE_ENV",
  // base urls
  BASE_URL_EMAIL_GENERATOR: "BASE_URL_EMAIL_GENERATOR",
  // auth
  AUTH_SECRET: "AUTH_SECRET",
  GITHUB_CLIENT_SECRET: "GITHUB_CLIENT_SECRET",
  GOOGLE_CLIENT_SECRET: "GOOGLE_CLIENT_SECRET",
  // messaging
  TELEGRAM_CHAT_ID: "TELEGRAM_CHAT_ID",
  TELEGRAM_TOPIC_ID: "TELEGRAM_TOPIC_ID",
  TELEGRAM_TOKEN: "TELEGRAM_TOKEN",
} as const
