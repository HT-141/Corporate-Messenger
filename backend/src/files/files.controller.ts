import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { FilesService } from './files.service';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Загрузить файл' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'userId', description: 'ID пользователя, загружающего файл' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('userId') userId: string,
  ) {
    return this.filesService.saveFileInfo(file, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех загруженных файлов' })
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Скачать файл по ID' })
  async download(@Param('id') id: string, @Res() res: Response) {
    const file = await this.filesService.findOne(id);
    res.download(`./uploads/${file.storedName}`, file.originalName);
  }
}
