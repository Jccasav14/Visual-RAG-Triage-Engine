import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TriageRecord } from './entities/triage-record.entity';
import { MedicalRestriction } from './entities/medical-restriction.entity';
import { DailyReport } from './entities/daily-report.entity';
import { TriageService } from './services/triage.service';
import { TriageController } from './controllers/triage.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const dbType = process.env.DB_TYPE || 'sqlite';
        if (dbType === 'sqlite') {
          return {
            type: 'sqlite',
            database: 'visual_rag_triage.sqlite',
            entities: [TriageRecord, MedicalRestriction, DailyReport],
            synchronize: true,
          };
        }
        return {
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgrespassword',
          database: process.env.DB_DATABASE || 'visual_rag_db',
          entities: [TriageRecord, MedicalRestriction, DailyReport],
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature([TriageRecord, MedicalRestriction, DailyReport]),
  ],
  controllers: [TriageController],
  providers: [TriageService],
})
export class AppModule {}
