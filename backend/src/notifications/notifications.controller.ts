import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Получить все уведомления пользователя' })
  findForUser(@Param('userId') userId: string) {
    return this.notificationsService.findForUser(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Отметить уведомление как прочитанное' })
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
