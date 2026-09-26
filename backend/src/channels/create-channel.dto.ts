import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({ example: 'Разработка' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Канал для обсуждения разработки', required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: ['932a9a46-56e4-4f71-b3db-ff808ed55aee'],
    description: 'Список ID пользователей, которых нужно добавить в канал',
    required: false,
  })
  @IsOptional()
  @IsArray()
  memberIds?: string[];
}
