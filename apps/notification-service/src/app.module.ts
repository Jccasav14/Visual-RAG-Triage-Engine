import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { SendGridService } from './sendgrid/sendgrid.service';
import { PostHogService } from './posthog/posthog.service';
import { RedisSubscriberService } from './listeners/redis-subscriber.service';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration], isGlobal: true })],
  providers: [SendGridService, PostHogService, RedisSubscriberService],
})
export class AppModule {}
