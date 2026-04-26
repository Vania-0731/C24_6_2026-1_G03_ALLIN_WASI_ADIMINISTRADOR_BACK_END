import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async findAll(): Promise<Property[]> {
    return this.propertyRepository.find({
      relations: ['landlord'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Property | null> {
    return this.propertyRepository.findOne({
      where: { id },
      relations: ['landlord'],
    });
  }

  async updateStatus(id: string, status: any): Promise<Property | null> {
    await this.propertyRepository.update(id, { status });
    return this.findById(id);
  }
}
