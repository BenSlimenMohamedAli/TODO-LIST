import { EnvType, load } from 'ts-dotenv';

export type Env = EnvType<typeof schema>;

export const schema = {
  PORT: Number,
  JWT_SECRET: String,
  JWT_EXPIRES_IN: Number,
  PASSWORD_REGEX: String,
  MONGO_USER: String,
  MONGO_PASSWORD: String,
  MONGO_AUTH_DB: String,
  MONGO_PORT: String,
  MONGO_HOST: String,
  MONGO_DB: String,
  MONGO_HAS_PASSWORD: Boolean,
  // admin account
  ADMIN_FIRSTNAME: String,
  ADMIN_LASTNAME: String,
  ADMIN_USERNAME: String,
  ADMIN_PASSWORD: String,
  ADMIN_ROLE: String,
};

export let env: Env;

export function loadEnv(): void {
  env = load(schema, {
    path:
      process.env.NODE_ENV === 'prod' ? '.env' : `.env.${process.env.NODE_ENV}`,
    overrideProcessEnv: true,
  });
}
