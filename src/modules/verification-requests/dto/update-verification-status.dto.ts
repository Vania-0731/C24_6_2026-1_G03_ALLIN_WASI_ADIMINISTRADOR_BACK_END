import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVerificationStatusDto {
  @ApiProperty({ enum: ['verified', 'rejected'] })
  @IsEnum(['verified', 'rejected'])
  status!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  message?: string;
}
