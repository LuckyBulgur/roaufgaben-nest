import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';

import { AppModule } from './app.module';

async function bootstrap() {
  const isProduction = __dirname.includes('root');
  const httpsOptions = {
    key: fs.readFileSync(__dirname.replace("dist", "") + 'server.key'),
    cert: fs.readFileSync(__dirname.replace("dist", "") + 'server.crt'),
  }
  const app = await NestFactory.create(AppModule, (isProduction) ? { httpsOptions } : {});
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen((isProduction) ? 443 : 3001);
}
bootstrap();