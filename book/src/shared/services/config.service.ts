import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
import {Injectable} from "@nestjs/common";

dotenv.config();

@Injectable()
class configService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getTypeOrmConfig(): TypeOrmModuleOptions {

    const config: TypeOrmModuleOptions = {
      type: 'mysql',
      host: this.env.DB_HOST,
      port: Number(this.env.DB_PORT),
      username: this.env.DB_USERNAME,
      password: this.env.DB_PASSWORD,
      database: this.env.DB_NAME,
      logging: false,
      entities: [join(__dirname, '..', '..', '**', '*.entity.{ts,js}')],
      migrationsTableName: 'migration',
      migrations: [join(__dirname, '..', 'migrations', '*.ts')],
      synchronize: true,
    };

    return config;
  }

  public getJwtSecret(): string | undefined {
    return this.env.JWT_SECRET;
  }

  public getJwtExpirationTime(): string | undefined {
    return this.env.TOKEN_EXPIRATION_TIME;
  }

  private getValue(key: string, throwOnMissing = true): string | undefined{
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`Config error - missing env.${key}`);
    }
    return value;
  }
}

const ConfigService = new configService(process.env);

export default ConfigService;
