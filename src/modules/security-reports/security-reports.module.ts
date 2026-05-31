import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityReportsController } from './controllers/security-reports.controller';
import { SecurityReportsService } from './services/security-reports.service';
import { SecurityReport } from './entities/security-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SecurityReport])],
  controllers: [SecurityReportsController],
  providers: [SecurityReportsService],
  exports: [SecurityReportsService],
})
export class SecurityReportsModule {}
