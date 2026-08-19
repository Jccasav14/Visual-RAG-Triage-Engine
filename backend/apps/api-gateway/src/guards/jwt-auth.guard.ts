import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Encabezado JWT de autorización faltante o inválido');
    }
    const token = authHeader.split(' ')[1];
    try {
      const secret = process.env.JWT_SECRET || 'visual-rag-secret-jwt-key-2026';
      const decoded: any = jwt.verify(token, secret);
      request.user = decoded;
      request.headers['x-user-id'] = decoded.sub;
      return true;
    } catch {
      throw new UnauthorizedException('Token JWT inválido o expirado');
    }
  }
}
