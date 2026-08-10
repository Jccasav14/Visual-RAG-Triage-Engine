import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';

@Injectable()
export class ProxyService {
  async forward(req: Request, res: Response, targetUrl: string) {
    const path = req.originalUrl.replace(/^\/v1\/[^\/]+/, '');
    try {
      const response = await axios({
        method: req.method,
        url: `${targetUrl}${path}`,
        data: req.body,
        headers: { ...req.headers, host: undefined },
      });
      res.status(response.status).json(response.data);
    } catch (err: any) {
      const status = err.response?.status || 500;
      res.status(status).json(err.response?.data || { message: 'Proxy Error' });
    }
  }
}
