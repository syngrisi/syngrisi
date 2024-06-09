import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str, bool } from 'envalid';
import crypto from 'crypto';

// Загружаем переменные окружения из .env файла
dotenv.config();

// Валидируем и очищаем переменные окружения
export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
  SYNGRISI_DB_URI: str({ devDefault: 'mongodb://127.0.0.1:27017/SyngrisiDb' }),
  SYNGRISI_APP_PORT: port({ devDefault: 3000 }),
  SYNGRISI_IMAGES_PATH: str({ devDefault: "./.snapshots-images/" }),
  SYNGRISI_HTTP_LOG: bool({ devDefault: false }),
  SYNGRISI_COVERAGE: bool({ devDefault: false }),

  SYNGRISI_HOSTNAME: host({ devDefault: 'localhost' }),

  SYNGRISI_AUTH: bool({ default: true }),
  SYNGRISI_TEST_MODE: bool({ default: false }),
  SYNGRISI_DISABLE_FIRST_RUN: bool({ default: false }),

  MONGODB_ROOT_USERNAME: str({ default: '' }),
  MONGODB_ROOT_PASSWORD: str({ default: '' }),
  LOGLEVEL: str({ choices: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'], default: 'debug' }),
  SYNGRISI_PAGINATION_SIZE: num({ default: 50 }),
  SYNGRISI_DISABLE_DEV_CORS: bool({ default: false, devDefault: true }),
  SYNGRISI_SESSION_STORE_KEY: str({ default: crypto.randomBytes(64).toString('hex') }),
});
