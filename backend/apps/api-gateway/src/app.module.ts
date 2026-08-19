import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyController } from './controllers/proxy.controller';
import { ProxyService } from './services/proxy.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class AppModule {}
