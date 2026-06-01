import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ReportStatus } from '../entities/report.entity';

export class CreateSecurityReportDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  severity?: string;

  @IsString()
  @IsOptional()
  reportedById?: string;
}

export class UpdateReportStatusDto {
  @IsEnum(ReportStatus)
  @IsNotEmpty()
  status: ReportStatus;
}
