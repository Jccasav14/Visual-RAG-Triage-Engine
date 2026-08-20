import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host') || process.env.DB_HOST || 'localhost',
        port: configService.get<number>('database.port') || parseInt(process.env.DB_PORT || '5432', 10),
        username: configService.get<string>('database.username') || process.env.DB_USERNAME || 'postgres',
        password: configService.get<string>('database.password') || process.env.DB_PASSWORD || 'postgrespassword',
        database: configService.get<string>('database.name') || process.env.DB_DATABASE || 'visual_rag_db',
        entities: [User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
