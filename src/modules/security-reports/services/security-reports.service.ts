import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityReport, SecurityStatus } from '../entities/security-report.entity';
import { CreateSecurityReportDto } from '../dto/security-report.dto';

@Injectable()
export class SecurityReportsService {
  constructor(
    @InjectRepository(SecurityReport)
    private securityReportsRepository: Repository<SecurityReport>,
  ) {}

  findAll() {
    return this.securityReportsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const report = await this.securityReportsRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Security report #${id} not found`);
    }
    return report;
  }

  create(createDto: CreateSecurityReportDto) {
    const report = this.securityReportsRepository.create(createDto);
    return this.securityReportsRepository.save(report);
  }

  async updateStatus(id: string, status: SecurityStatus) {
    const report = await this.findOne(id);
    report.status = status;
    return this.securityReportsRepository.save(report);
  }

  async remove(id: string) {
    const report = await this.findOne(id);
    return this.securityReportsRepository.remove(report);
  }
}
