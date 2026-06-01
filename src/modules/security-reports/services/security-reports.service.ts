import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus } from '../entities/report.entity';
import { CreateSecurityReportDto } from '../dto/security-report.dto';

@Injectable()
export class SecurityReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  findAll() {
    return this.reportsRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['reporter', 'reportedUser'],
    });
  }

  async findOne(id: string) {
    const report = await this.reportsRepository.findOne({ 
      where: { id },
      relations: ['reporter', 'reportedUser'],
    });
    if (!report) {
      throw new NotFoundException(`Report #${id} not found`);
    }
    return report;
  }

  create(createDto: CreateSecurityReportDto) {
    // Map the Admin's Global Alert fields into the 'reason' JSON string
    const reasonObj = {
      isAdminAlert: true,
      title: createDto.title,
      description: createDto.description,
      location: createDto.location,
      severity: createDto.severity,
    };

    const report = this.reportsRepository.create({
      reporterId: createDto.reportedById,
      reason: JSON.stringify(reasonObj),
      status: ReportStatus.PENDING,
    });
    
    return this.reportsRepository.save(report);
  }

  async updateStatus(id: string, status: ReportStatus) {
    const report = await this.findOne(id);
    report.status = status;
    return this.reportsRepository.save(report);
  }

  async remove(id: string) {
    const report = await this.findOne(id);
    return this.reportsRepository.remove(report);
  }
}
