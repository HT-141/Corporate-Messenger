import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { Channel } from '../channels/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Channel])],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
