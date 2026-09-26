import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ example: 'Привет всем!' })
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: '932a9a46-56e4-4f71-b3db-ff808ed55aee' })
  @IsNotEmpty()
  authorId: string;

  @ApiProperty({
    example: '54523580-55f0-4ccb-a487-770ec8af408b',
    description: 'ID канала (для сообщения в канал). Не указывать для личного сообщения.',
    required: false,
  })
  @IsOptional()
  channelId?: string;

  @ApiProperty({
    example: '932a9a46-56e4-4f71-b3db-ff808ed55aee',
    description: 'ID получателя (для личного сообщения). Не указывать для сообщения в канал.',
    required: false,
  })
  @IsOptional()
  recipientId?: string;
}
