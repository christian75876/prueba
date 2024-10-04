import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { EnvConfig } from './env.config';

@Injectable()
export class DatabaseConfigService implements MongooseOptionsFactory {
  createMongooseOptions():
    | Promise<MongooseModuleOptions>
    | MongooseModuleOptions {
    const envConfig = EnvConfig();
    return {
      uri: envConfig.mongoUri,
    };
  }
}
