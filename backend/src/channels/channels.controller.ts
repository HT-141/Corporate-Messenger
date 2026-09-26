import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './create-channel.dto';

@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый канал' })
  create(@Body() dto: CreateChannelDto) {
    return this.channelsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех каналов' })
  findAll() {
    return this.channelsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить канал по ID (с участниками)' })
  findOne(@Param('id') id: string) {
    return this.channelsService.findOne(id);
  }

  @Post(':id/members/:userId')
  @ApiOperation({ summary: 'Добавить пользователя в канал' })
  addMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.channelsService.addMember(id, userId);
  }
}
