import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { SettingsService } from '../services/settings.service';
import { UpdateSettingDto } from '../dto/setting.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('public')
  getPublicSettings() {
    return this.settingsService.getPublicSettings();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('bulk')
  updateMultiple(@Body() updates: { key: string; value: string }[]) {
    return this.settingsService.updateMultiple(updates);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':key')
  update(@Param('key') key: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(key, updateSettingDto);
  }
}
