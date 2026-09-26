import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from '../users/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userId: string, text: string): Promise<Notification> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const notification = this.notificationsRepository.create({ text, user });
    return this.notificationsRepository.save(notification);
  }

  async findForUser(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException('Уведомление не найдено');
    }
    notification.isRead = true;
    return this.notificationsRepository.save(notification);
  }
}
