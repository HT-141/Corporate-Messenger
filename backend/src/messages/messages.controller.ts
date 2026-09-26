import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './create-message.dto';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Отправить сообщение (в канал или личное)' })
  create(@Body() dto: CreateMessageDto) {
    return this.messagesService.create(dto);
  }

  @Get('channel/:channelId')
  @ApiOperation({ summary: 'Получить все сообщения канала (историю переписки)' })
  findByChannel(@Param('channelId') channelId: string) {
    return this.messagesService.findByChannel(channelId);
  }

  @Get('direct/:userId1/:userId2')
  @ApiOperation({ summary: 'Получить личную переписку между двумя пользователями' })
  findConversation(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
  ) {
    return this.messagesService.findConversation(userId1, userId2);
  }
}
