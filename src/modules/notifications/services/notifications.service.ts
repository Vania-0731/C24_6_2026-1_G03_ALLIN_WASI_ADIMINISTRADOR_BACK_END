import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  async findAll(userId?: string) {
    const query = this.notificationsRepository.createQueryBuilder('notification')
      .orderBy('notification.createdAt', 'DESC');

    if (userId) {
      // Fetch notifications that are global (no userId) OR belong to the specific user
      query.where('notification.userId IS NULL OR notification.userId = :userId', { userId });
    }

    return query.getMany();
  }

  async getUnreadCount(userId?: string) {
    const query = this.notificationsRepository.createQueryBuilder('notification')
      .where('notification.isRead = :isRead', { isRead: false });

    if (userId) {
      query.andWhere('(notification.userId IS NULL OR notification.userId = :userId)', { userId });
    }

    return query.getCount();
  }

  async create(createDto: CreateNotificationDto) {
    const notification = this.notificationsRepository.create(createDto);
    return this.notificationsRepository.save(notification);
  }

  async markAsRead(id: string) {
    const notification = await this.notificationsRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    notification.isRead = true;
    return this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userId?: string) {
    const query = this.notificationsRepository.createQueryBuilder()
      .update(Notification)
      .set({ isRead: true })
      .where('isRead = :isRead', { isRead: false });

    if (userId) {
      query.andWhere('(userId IS NULL OR userId = :userId)', { userId });
    }

    await query.execute();
    return { message: 'All notifications marked as read' };
  }
}
