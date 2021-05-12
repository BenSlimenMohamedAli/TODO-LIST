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
};

export let env: Env;

export function loadEnv(): void {
  env = load(schema, {
    path:
      process.env.NODE_ENV === 'prod' ? '.env' : `.env.${process.env.NODE_ENV}`,
    overrideProcessEnv: true,
  });
}
