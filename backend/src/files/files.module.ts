import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileEntity } from './file.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity, User])],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
