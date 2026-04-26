import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { ToursService } from './tours.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TourStatus } from './entities/tour.entity';

@ApiTags('tours-360')
@ApiBearerAuth()
@Controller('tours-360')
@UseGuards(JwtAuthGuard)
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tours 360' })
  findAll() {
    return this.toursService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas globales de tours' })
  getStats() {
    return this.toursService.getStats();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar estado de moderación de un tour' })
  updateStatus(@Param('id') id: string, @Body('status') status: TourStatus) {
    return this.toursService.updateStatus(id, status);
  }
}
