import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationRequestsService } from './verification-requests.service';
import { VerificationRequestsController } from './verification-requests.controller';
import { LandlordProfile } from './entities/landlord-profile.entity';
import { TenantProfile } from './entities/tenant-profile.entity';
import { User } from '../users/entities/user.entity';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LandlordProfile, TenantProfile, User]),
    SettingsModule,
  ],
  controllers: [VerificationRequestsController],
  providers: [VerificationRequestsService],
  exports: [VerificationRequestsService],
})
export class VerificationRequestsModule {}
