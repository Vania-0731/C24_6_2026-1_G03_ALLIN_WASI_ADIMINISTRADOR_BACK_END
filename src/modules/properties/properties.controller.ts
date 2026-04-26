import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('properties')
@ApiBearerAuth()
@Controller('properties')
@UseGuards(JwtAuthGuard)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las propiedades' })
  findAll() {
    return this.propertiesService.findAll();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado de una propiedad (Aprobar/Rechazar)' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.propertiesService.updateStatus(id, status);
  }
}
