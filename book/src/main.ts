import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as dotenv from 'dotenv';
import {WINSTON_MODULE_NEST_PROVIDER} from "nest-winston";
import {ValidationPipe} from "@nestjs/common";


async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.enableCors({
  //   origin: 'http://localhost:4200', // Your Angular app's URL
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  // });

  await app.listen(process.env.PORT || 3000);
  console.log("started server on : ", process.env.PORT);
}
bootstrap();