import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('Content-Length');
      const responseTime = Date.now() - startTime;

      const logMessage = `${method} ${originalUrl} ${statusCode} ${contentLength || 0}b - ${responseTime}ms - ${ip} ${userAgent}`;
      
      if (statusCode >= 400) {
        this.logger.error(logMessage);
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }
}