import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandlordProfile } from './entities/landlord-profile.entity';
import { TenantProfile } from './entities/tenant-profile.entity';
import { User } from '../users/entities/user.entity';
import { UpdateVerificationStatusDto } from './dto/update-verification-status.dto';
import { SettingsService } from '../settings/services/settings.service';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class VerificationRequestsService {
  constructor(
    @InjectRepository(LandlordProfile)
    private readonly landlordRepo: Repository<LandlordProfile>,
    @InjectRepository(TenantProfile)
    private readonly tenantRepo: Repository<TenantProfile>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly settingsService: SettingsService,
  ) {}

  async findAll() {
    return await this.landlordRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async proxyImage(url: string, res: any) {
    if (!url) {
      res.status(400).json({ message: 'URL es requerida' });
      return;
    }

    try {
      const accessKeyId = await this.settingsService.findByKey('AWS_ACCESS_KEY_ID');
      const secretAccessKey = await this.settingsService.findByKey('AWS_SECRET_ACCESS_KEY');
      const region = await this.settingsService.findByKey('AWS_REGION');
      const bucketName = await this.settingsService.findByKey('AWS_S3_BUCKET');

      if (!accessKeyId?.value || !secretAccessKey?.value || !region?.value || !bucketName?.value) {
        res.status(500).json({ message: 'Credenciales AWS no configuradas' });
        return;
      }

      const urlObj = new URL(url);
      const key = urlObj.pathname.substring(1);

      const s3Client = new S3Client({
        region: region.value,
        credentials: {
          accessKeyId: accessKeyId.value,
          secretAccessKey: secretAccessKey.value,
        },
      });

      const command = new GetObjectCommand({ Bucket: bucketName.value, Key: key });
      const response = await s3Client.send(command);

      res.setHeader('Content-Type', response.ContentType || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      
      const body = response.Body as any;
      if (body && typeof body.pipe === 'function') {
        body.pipe(res);
      } else {
        res.status(500).json({ message: 'S3 response body is not a readable stream' });
      }
    } catch (error: any) {
      console.error('Error in proxyImage', error);
      if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
        res.status(404).json({ message: 'Archivo no encontrado' });
      } else {
        res.status(500).json({ message: 'Error al proxy de imagen' });
      }
    }
  }

  async updateStatus(id: string, dto: UpdateVerificationStatusDto) {
    const profile = await this.landlordRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Perfil de arrendador no encontrado');
    }

    // Update the profile status
    profile.verificationStatus = dto.status;
    
    if (dto.status === 'rejected' && dto.message) {
      profile.verificationMessage = dto.message;
    } else {
      profile.verificationMessage = ''; // clear message if approved
    }

    await this.landlordRepo.save(profile);

    // If verified, update the user table
    if (dto.status === 'verified') {
      await this.userRepo.update(profile.userId, { isVerified: true });
    } else if (dto.status === 'rejected') {
      await this.userRepo.update(profile.userId, { isVerified: false });
    }

    return profile;
  }

  async findAllTenants() {
    return await this.tenantRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateTenantStatus(id: string, dto: UpdateVerificationStatusDto) {
    const profile = await this.tenantRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Perfil de estudiante no encontrado');
    }

    profile.verificationStatus = dto.status;
    
    if (dto.status === 'rejected' && dto.message) {
      profile.verificationMessage = dto.message;
    } else {
      profile.verificationMessage = '';
    }

    await this.tenantRepo.save(profile);

    if (dto.status === 'verified') {
      await this.userRepo.update(profile.userId, { isVerified: true });
    } else if (dto.status === 'rejected') {
      await this.userRepo.update(profile.userId, { isVerified: false });
    }

    return profile;
  }
}
