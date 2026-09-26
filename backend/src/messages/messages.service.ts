import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { Channel } from '../channels/channel.entity';
import { CreateMessageDto } from './create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
  ) {}

  async create(dto: CreateMessageDto): Promise<Message> {
    if (!dto.channelId && !dto.recipientId) {
      throw new BadRequestException(
        'Нужно указать либо channelId (сообщение в канал), либо recipientId (личное сообщение)',
      );
    }
    if (dto.channelId && dto.recipientId) {
      throw new BadRequestException(
        'Нельзя указывать одновременно channelId и recipientId',
      );
    }

    const author = await this.usersRepository.findOne({
      where: { id: dto.authorId },
    });
    if (!author) {
      throw new NotFoundException('Автор сообщения не найден');
    }

    const message = this.messagesRepository.create({ text: dto.text, author });

    if (dto.channelId) {
      const channel = await this.channelsRepository.findOne({
        where: { id: dto.channelId },
      });
      if (!channel) {
        throw new NotFoundException('Канал не найден');
      }
      message.channel = channel;
    }

    if (dto.recipientId) {
      const recipient = await this.usersRepository.findOne({
        where: { id: dto.recipientId },
      });
      if (!recipient) {
        throw new NotFoundException('Получатель не найден');
      }
      message.recipient = recipient;
    }

    return this.messagesRepository.save(message);
  }

  async findByChannel(channelId: string): Promise<Message[]> {
    return this.messagesRepository.find({
      where: { channel: { id: channelId } },
      relations: { author: true },
      order: { createdAt: 'ASC' },
    });
  }

  async findConversation(userId1: string, userId2: string): Promise<Message[]> {
    const messages = await this.messagesRepository.find({
      relations: { author: true, recipient: true },
      order: { createdAt: 'ASC' },
    });

    return messages.filter(
      (m) =>
        m.recipient &&
        ((m.author.id === userId1 && m.recipient.id === userId2) ||
          (m.author.id === userId2 && m.recipient.id === userId1)),
    );
  }
}
