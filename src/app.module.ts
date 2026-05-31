import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { AdminsModule } from './modules/admins/admins.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { ToursModule } from './modules/tours/tours.module';
import { SecurityReportsModule } from './modules/security-reports/security-reports.module';
import { SettingsModule } from './modules/settings/settings.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { VerificationRequestsModule } from './modules/verification-requests/verification-requests.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    AdminsModule,
    PropertiesModule,
    ToursModule,
    SecurityReportsModule,
    SettingsModule,
    NotificationsModule,
    VerificationRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
