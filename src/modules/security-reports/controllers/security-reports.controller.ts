import { Controller, Get, Param, Patch, Body, UseGuards, Post, Req } from '@nestjs/common';
import { SecurityReportsService } from '../services/security-reports.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SecurityStatus } from '../entities/security-report.entity';
import { CreateSecurityReportDto, UpdateSecurityReportStatusDto } from '../dto/security-report.dto';

@ApiTags('security-reports')
@ApiBearerAuth()
@Controller('security-reports')
@UseGuards(JwtAuthGuard)
export class SecurityReportsController {
  constructor(private readonly securityReportsService: SecurityReportsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los reportes de seguridad' })
  findAll() {
    return this.securityReportsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Crear un reporte de seguridad' })
  create(@Body() createDto: CreateSecurityReportDto, @Req() req: any) {
    // jwt.strategy.ts devuelve el sub del JWT como 'userId'
    createDto.reportedById = req?.user?.userId;
    return this.securityReportsService.create(createDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar estado de reporte' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateSecurityReportStatusDto) {
    return this.securityReportsService.updateStatus(id, updateStatusDto.status);
  }
}
