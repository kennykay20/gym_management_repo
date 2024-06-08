import * as dotenv from 'dotenv';
import * as joi from 'joi';

process.env.ENV_PATH
  ? dotenv.config({ path: process.env.ENV_PATH })
  : dotenv.config();

// validating environment variables
const schemaValidate = joi
  .object({
    HTTP_PORT: joi.number().required(),
    NODE_ENV: joi
      .string()
      .valid('development', 'staging', 'production')
      .required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    SECRET: joi.string(),
    JWT_EXPIRE: joi.number(),
  })
  .unknown()
  .required();

const { error, value: envVal } = schemaValidate.validate(process.env);

if (error) {
  throw new Error(`config validation error ${error.message}`);
}

const nonProdEnvironments = ['development', 'dev', 'staging'];

export const config = {
  isDevelopment: nonProdEnvironments.includes(envVal.NODE_ENV) ? true : false,
  isLocahost: envVal.NODE_ENV === 'development' || 'dev' ? true : false,
  port: {
    HTTP_PORT: envVal.HTTP_PORT,
  },
  NODE_ENV: envVal.NODE_ENV,
  Secret: envVal.SECRET,
  jwtexpire: envVal.JWT_EXPIRE,
  DB: {
    HOST: envVal.DB_HOST,
    PORT: envVal.DB_PORT,
    USERNAME: envVal.DB_USERNAME,
    PASSWORD: envVal.DB_PASSWORD,
    NAME: envVal.DB_NAME,
  },
};
