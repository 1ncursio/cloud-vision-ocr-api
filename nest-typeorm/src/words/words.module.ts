import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Words } from '../entities/Words';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Words])],
  providers: [WordsService],
  exports: [WordsService],
  controllers: [WordsController],
})
export class WordsModule {}
