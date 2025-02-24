import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './resources/auth/auth.guard';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://127.0.0.1:5500', // TODO: handle this in a better way
    credentials: true,
  });
  setGlobalAuthGuard(app);

  await app.listen(process.env.PORT ?? 3000);
}

function setGlobalAuthGuard(app: INestApplication<any>) {
  const jwtService = new JwtService({});
  const configService = new ConfigService();
  const reflector = new Reflector();

  app.useGlobalGuards(new AuthGuard(jwtService, configService, reflector));
}

bootstrap();
