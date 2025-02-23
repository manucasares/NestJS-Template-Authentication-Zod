import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './resources/auth/auth.guard';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
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
