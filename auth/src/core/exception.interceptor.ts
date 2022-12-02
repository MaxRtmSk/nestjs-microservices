import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
    async catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const request = context.getRequest<Request>();
        const response = context.getResponse<Response>();

        const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

        response.status(statusCode).json({
            statusCode,
            message: request,
        });
    }
}