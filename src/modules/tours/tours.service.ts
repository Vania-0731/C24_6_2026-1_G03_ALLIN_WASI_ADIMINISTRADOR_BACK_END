import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tour360, TourStatus } from './entities/tour.entity';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour360)
    private readonly tourRepository: Repository<Tour360>,
  ) {}

  async findAll() {
    return this.tourRepository.find({
      relations: ['property', 'property.landlord'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: TourStatus) {
    await this.tourRepository.update(id, { status });
    return this.tourRepository.findOne({ where: { id }, relations: ['property'] });
  }

  async getStats() {
    const total = await this.tourRepository.count();
    const pending = await this.tourRepository.count({ where: { status: TourStatus.PENDING } });
    const approved = await this.tourRepository.count({ where: { status: TourStatus.APPROVED } });
    const totalVisits = await this.tourRepository.sum('visits', {});

    return {
      total,
      pending,
      approved,
      totalVisits: totalVisits || 0
    };
  }
}
