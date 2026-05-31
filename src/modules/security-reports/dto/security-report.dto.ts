import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { SecuritySeverity, SecurityStatus } from '../entities/security-report.entity';

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

  @IsEnum(SecuritySeverity)
  @IsOptional()
  severity?: SecuritySeverity;

  @IsString()
  @IsOptional()
  reportedById?: string;
}

export class UpdateSecurityReportStatusDto {
  @IsEnum(SecurityStatus)
  @IsNotEmpty()
  status: SecurityStatus;
}
