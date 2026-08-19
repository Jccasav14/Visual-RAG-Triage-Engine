import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

const logger = new Logger('DatabaseSetup');

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbType = process.env.DB_TYPE || 'postgres';
        if (dbType === 'sqlite') {
          return {
            type: 'sqlite',
            database: 'visual_rag_identity.sqlite',
            entities: [User],
            synchronize: true,
          };
        }
        return {
          type: 'postgres',
          host: configService.get<string>('database.host') || 'localhost',
          port: configService.get<number>('database.port') || 5432,
          username: configService.get<string>('database.username') || 'postgres',
          password: configService.get<string>('database.password') || 'postgrespassword',
          database: configService.get<string>('database.name') || 'visual_rag_db',
          entities: [User],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
