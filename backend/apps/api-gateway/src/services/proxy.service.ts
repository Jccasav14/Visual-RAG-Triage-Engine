import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';

@Injectable()
export class ProxyService {
  async forward(req: Request, res: Response, targetUrl: string) {
    try {
      const path = req.originalUrl.replace(/^\/v1\/[^\/]+/, '');
      const url = `${targetUrl}${path}`;

      const response = await axios({
        method: req.method,
        url,
        data: req.body,
        headers: {
          ...req.headers,
          host: new URL(targetUrl).host,
        },
      });

      return res.status(response.status).json(response.data);
    } catch (error: any) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      throw new HttpException(
        `Error al redirigir petición hacia ${targetUrl}: ${error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
