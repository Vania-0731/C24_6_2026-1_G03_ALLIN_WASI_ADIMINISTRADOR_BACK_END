import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tour360 } from './entities/tour.entity';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tour360])],
  controllers: [ToursController],
  providers: [ToursService],
  exports: [ToursService],
})
export class ToursModule {}
