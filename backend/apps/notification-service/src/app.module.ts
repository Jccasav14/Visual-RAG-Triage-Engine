import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';

@Module({
  imports: [],
  providers: [NotificationService],
})
export class AppModule {}
