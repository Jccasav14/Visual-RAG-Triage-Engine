import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class RedisSubscriberService implements OnModuleInit {
  onModuleInit() {
    console.log('[NOTIFICATION SERVICE] Subscribed to Redis PubSub critical alerts stream.');
  }
}
