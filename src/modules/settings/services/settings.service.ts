import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../entities/setting.entity';
import { CreateSettingDto, UpdateSettingDto } from '../dto/setting.dto';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async onModuleInit() {
    await this.seedDefaultSettings();
  }

  private async seedDefaultSettings() {
    const defaultSettings: CreateSettingDto[] = [
      { key: 'PLATFORM_NAME', value: 'TECSUP Rentals', description: 'Nombre de la Plataforma', type: 'string', group: 'general' },
      { key: 'PLATFORM_VERSION', value: '1.2.4', description: 'Versión del Sistema', type: 'string', group: 'general' },
      { key: 'PLATFORM_DESCRIPTION', value: 'Plataforma de visitas virtuales 360° para estudiantes', description: 'Descripción de la Plataforma', type: 'string', group: 'general' },
      { key: 'MAX_PROPERTIES_PER_HOST', value: '10', description: 'Máximo de Propiedades por Anfitrión', type: 'number', group: 'general' },
      { key: 'MAX_TOURS_PER_PROPERTY', value: '5', description: 'Máximo de Tours por Propiedad', type: 'number', group: 'general' },
      { key: 'MAX_IMAGE_SIZE_MB', value: '100', description: 'Tamaño Máximo de Imagen (MB)', type: 'number', group: 'general' },
      
      // Funciones
      { key: 'ENABLE_PUBLIC_REGISTRATION', value: 'true', description: 'Habilitar registro público', type: 'boolean', group: 'features' },
      { key: 'MAINTENANCE_MODE', value: 'false', description: 'Modo de mantenimiento', type: 'boolean', group: 'features' },
      
      // Seguridad
      { key: 'PASSWORD_MIN_LENGTH', value: '8', description: 'Longitud mínima de contraseña', type: 'number', group: 'security' },
      { key: 'SESSION_TIMEOUT_MINUTES', value: '60', description: 'Tiempo de expiración de sesión (minutos)', type: 'number', group: 'security' },

      // Notificaciones
      { key: 'EMAIL_HOST', value: 'smtp.gmail.com', description: 'Servidor SMTP', type: 'string', group: 'notifications' },
      { key: 'EMAIL_PORT', value: '587', description: 'Puerto SMTP', type: 'number', group: 'notifications' },
      { key: 'EMAIL_USER', value: 'sonalysifuentes@gmail.com', description: 'Usuario SMTP', type: 'string', group: 'notifications' },
      { key: 'EMAIL_PASS', value: '', description: 'Contraseña SMTP', type: 'string', group: 'notifications' },
      { key: 'ADMIN_ALERTS_ENABLED', value: 'true', description: 'Habilitar Alertas de Administrador', type: 'boolean', group: 'notifications' },

      // Usuarios
      { key: 'DEFAULT_ROLE', value: 'tenant', description: 'Rol por Defecto de Registro', type: 'string', group: 'users' },
      { key: 'REQUIRE_MANUAL_APPROVAL', value: 'false', description: 'Requerir Aprobación Manual de Usuarios', type: 'boolean', group: 'users' },

      // Backup
      { key: 'BACKUP_FREQUENCY', value: 'weekly', description: 'Frecuencia de Copia de Seguridad', type: 'string', group: 'backup' },
      { key: 'BACKUP_RETENTION_DAYS', value: '30', description: 'Días de Retención', type: 'number', group: 'backup' },

      // Integraciones - AWS
      { key: 'AWS_ACCESS_KEY_ID', value: 'AKIAXN6LMXXXTBSHGDGY', description: 'AWS Access Key ID', type: 'string', group: 'integrations' },
      { key: 'AWS_SECRET_ACCESS_KEY', value: '', description: 'AWS Secret Access Key', type: 'string', group: 'integrations' },
      { key: 'AWS_REGION', value: 'us-east-1', description: 'AWS Región', type: 'string', group: 'integrations' },
      { key: 'AWS_S3_BUCKET', value: 'tecsup-rooms-media', description: 'AWS S3 Bucket Name', type: 'string', group: 'integrations' },
      { key: 'AWS_S3_BASE_URL', value: 'https://tecsup-rooms-media.s3.us-east-1.amazonaws.com', description: 'AWS S3 Base URL', type: 'string', group: 'integrations' },
      
      // Integraciones - Google
      { key: 'GOOGLE_CLIENT_ID', value: '72353546719-sbfd3j557r9odu4api1jva3cfgkgmvkb.apps.googleusercontent.com', description: 'Google Client ID (OAuth)', type: 'string', group: 'integrations' },
      { key: 'GOOGLE_CLIENT_SECRET', value: '', description: 'Google Client Secret (OAuth)', type: 'string', group: 'integrations' },
      { key: 'GOOGLE_CALLBACK_URL', value: 'http://localhost:3000/auth-test/google/callback', description: 'Google Callback URL', type: 'string', group: 'integrations' },
      { key: 'GOOGLE_API_KEY', value: 'AIzaSyDb5MW5ie9yS3DAi6iQrvWaXCPruzJZ0to', description: 'Google API Key (Maps)', type: 'string', group: 'integrations' },
      { key: 'GEMINI_MODEL_NAME', value: 'gemini-2.5-flash', description: 'Modelo de Gemini AI', type: 'string', group: 'integrations' },
    ];

    for (const setting of defaultSettings) {
      const exists = await this.settingRepository.findOne({ where: { key: setting.key } });
      if (!exists) {
        await this.settingRepository.save(this.settingRepository.create(setting));
      }
    }
  }

  async findAll() {
    await this.seedDefaultSettings();
    return this.settingRepository.find();
  }

  async findByKey(key: string) {
    const setting = await this.settingRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key ${key} not found`);
    }
    return setting;
  }

  async update(key: string, updateSettingDto: UpdateSettingDto) {
    const setting = await this.findByKey(key);
    Object.assign(setting, updateSettingDto);
    return this.settingRepository.save(setting);
  }

  async updateMultiple(updates: { key: string; value: string }[]) {
    const updatedSettings: Setting[] = [];
    for (const update of updates) {
      const setting = await this.settingRepository.findOne({ where: { key: update.key } });
      if (setting) {
        setting.value = update.value;
        const updated = await this.settingRepository.save(setting);
        updatedSettings.push(updated);
      }
    }
    return updatedSettings;
  }

  async getPublicSettings() {
    const keys = ['PLATFORM_NAME', 'PLATFORM_VERSION', 'PLATFORM_DESCRIPTION'];
    const settings = await this.settingRepository.createQueryBuilder('setting')
      .where('setting.key IN (:...keys)', { keys })
      .getMany();
    
    // Convert array to object { PLATFORM_NAME: 'TECSUP Rentals', ... }
    return settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
  }
}
