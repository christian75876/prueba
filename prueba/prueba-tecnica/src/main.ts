import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger as Logger } from '@nestjs/common';
import { HttpErrorFilter } from './common/filters/error-filter.filters';
import { globalValidationPipes } from './common/pipes/global-pipes.pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(globalValidationPipes);
  app.setGlobalPrefix('api');
  const port = process.env.PORT || 4300;
  app.useGlobalFilters(new HttpErrorFilter());
  await app.listen(port);
  Logger.log(`App running at http://localhost:${port}`);
}
bootstrap();
