import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './file.entity';
import { User } from '../users/user.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async saveFileInfo(
    file: Express.Multer.File,
    uploadedById: string,
  ): Promise<FileEntity> {
    const user = await this.usersRepository.findOne({
      where: { id: uploadedById },
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const fileRecord = this.filesRepository.create({
      originalName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      uploadedBy: user,
    });

    return this.filesRepository.save(fileRecord);
  }

  async findAll(): Promise<FileEntity[]> {
    return this.filesRepository.find({
      relations: { uploadedBy: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<FileEntity> {
    const file = await this.filesRepository.findOne({
      where: { id },
      relations: { uploadedBy: true },
    });
    if (!file) {
      throw new NotFoundException('Файл не найден');
    }
    return file;
  }
}
