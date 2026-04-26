import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser])],
  exports: [TypeOrmModule],
})
export class AdminsModule {}
