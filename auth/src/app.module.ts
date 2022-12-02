import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { AllExceptionsFilter } from './core/exception.interceptor';
import { PrismaService } from './core/services/prisma.service';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('RABBITMQ_URL')}`],
            queue: `${configService.get('auth_queue')}`,
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    AppService,
    PrismaService
  ],
})
export class AppModule { }
