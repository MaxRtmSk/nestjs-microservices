import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { ResponseInterceptor } from './core/response.interceptor';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const moduleRef = app.select(AppModule);
  const reflector = moduleRef.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`RABBITMQ_URL`],
      queue: `${configService.get('auth_queue')}`,
      queueOptions: { durable: true },
      // prefetchCount: 1,
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
  logger.log(
    `Auth service running on port ${configService.get('PORT')}`,
  );
}
bootstrap();
