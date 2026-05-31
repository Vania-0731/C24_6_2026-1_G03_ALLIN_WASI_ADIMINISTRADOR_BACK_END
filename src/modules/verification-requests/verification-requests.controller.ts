import { Controller, Get, Patch, Param, Body, UseGuards, Query, Res, Options } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { VerificationRequestsService } from './verification-requests.service';
import { UpdateVerificationStatusDto } from './dto/update-verification-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Verification Requests')
@Controller('verification-requests')
export class VerificationRequestsController {
  constructor(private readonly verificationRequestsService: VerificationRequestsService) {}

  @Get('landlords')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todas las solicitudes de arrendadores' })
  findAll() {
    return this.verificationRequestsService.findAll();
  }

  @Patch('landlords/:id/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Aprobar o rechazar solicitud de arrendador' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVerificationStatusDto,
  ) {
    return this.verificationRequestsService.updateStatus(id, dto);
  }

  @Get('tenants')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todas las solicitudes de estudiantes' })
  findAllTenants() {
    return this.verificationRequestsService.findAllTenants();
  }

  @Patch('tenants/:id/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Aprobar o rechazar solicitud de estudiante' })
  updateTenantStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVerificationStatusDto,
  ) {
    return this.verificationRequestsService.updateTenantStatus(id, dto);
  }

  @Get('proxy')
  @ApiOperation({ summary: 'Proxy para servir imágenes de S3' })
  async proxy(@Query('url') url: string, @Res() res: Response) {
    return this.verificationRequestsService.proxyImage(url, res);
  }
}
