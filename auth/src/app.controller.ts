import { ClassSerializerInterceptor, Controller, Get, HttpStatus, Res, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { AllowUnauthorizedRequest } from './core/allow.unauthorized.decorator';
import { PrismaService } from './core/services/prisma.service';
import { Response } from 'express';


@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AppController {
  constructor(private readonly appService: AppService, private prisma: PrismaService) { }

  @AllowUnauthorizedRequest()
  @Get('/health')
  public healthCheck(@Res() res: Response) {
    this.prisma.$connect().then(() => {
      return res.status(HttpStatus.OK).json({ stauts: "ok" });
    }).catch((e) => {
      return res.status(HttpStatus.OK).json({ stauts: "down", error: e });
    })
  }

  @AllowUnauthorizedRequest()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
