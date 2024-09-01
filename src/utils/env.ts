import dotenv from 'dotenv';
dotenv.config();

const requiredVariables = ['DATABASE_URL', 'NODE_ENV'] as const;

type Env = {
  [key in (typeof requiredVariables)[number]]: string;
} & {
  PORT: number;
  JWT_SECRET_KEY: string;
};

const env: Env = {} as Env;

for (const variable of requiredVariables) {
  const value = process.env[variable];
  if (!value) {
    console.error(`[error] No ${variable} enviroment variable in .env file`);
    process.exit(1);
  }
  env[variable] = value;
}

env.PORT = Number(process.env.PORT ?? 3000);
env.JWT_SECRET_KEY =
  (process.env.JWT_SECRET_KEY as string) || 'default_secret_key';

export default env;
