import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);
  private subscriber: Redis;

  onModuleInit() {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = parseInt(process.env.REDIS_PORT || '6379', 10);
    this.subscriber = new Redis({ host, port, retryStrategy: () => 5000 });
    this.subscriber.on('error', () => {
      // Quietly handle Redis connection retry
    });

    this.subscriber.subscribe('triage:events', (err) => {
      if (err) {
        this.logger.error('Error al suscribir a eventos de triaje en Redis', err);
      } else {
        this.logger.log('Suscrito a canal de Redis: triage:events');
      }
    });

    this.subscriber.on('message', (channel, message) => {
      if (channel === 'triage:events') {
        try {
          const event = JSON.parse(message);
          this.handleTriageEvent(event);
        } catch (e) {
          this.logger.error('Error al parsear evento de Redis', e);
        }
      }
    });
  }

  private handleTriageEvent(event: any) {
    this.logger.log(`📬 [NOTIFICACIÓN] Evento recibido [${event.eventType}]: Usuario ${event.payload?.userId}, Prioridad: ${event.payload?.priority}`);
    if (event.payload?.priority === 'HIGH' || event.payload?.priority === 'CRITICAL') {
      this.logger.warn(`⚠️ ALERTA URGENTE DESPACHADA: Triaje ${event.payload?.triageRecordId} requiere atención inmediata.`);
    }
  }
}
