import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Channel } from './channel.entity';
import { User } from '../users/user.entity';
import { CreateChannelDto } from './create-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateChannelDto): Promise<Channel> {
    let members: User[] = [];
    if (dto.memberIds && dto.memberIds.length > 0) {
      members = await this.usersRepository.findBy({ id: In(dto.memberIds) });
    }

    const channel = this.channelsRepository.create({
      name: dto.name,
      description: dto.description,
      members,
    });

    return this.channelsRepository.save(channel);
  }

  async findAll(): Promise<Channel[]> {
    return this.channelsRepository.find({ relations: { members: true } });
  }

  async findOne(id: string): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({
      where: { id },
      relations:  { members: true },
    });
    if (!channel) {
      throw new NotFoundException('Канал не найден');
    }
    return channel;
  }

  async addMember(channelId: string, userId: string): Promise<Channel> {
    const channel = await this.findOne(channelId);
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const alreadyMember = channel.members.some((m) => m.id === user.id);
    if (!alreadyMember) {
      channel.members.push(user);
      await this.channelsRepository.save(channel);
    }

    return channel;
  }
}
