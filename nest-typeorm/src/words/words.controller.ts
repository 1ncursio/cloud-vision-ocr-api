import { Body, Controller, Get, Post } from '@nestjs/common';
import { WordsService } from './words.service';
import { CreateWordDto } from './dto/create-word.dto';

@Controller('words')
export class WordsController {
  constructor(private wordsService: WordsService) {}

  @Get()
  getWords() {
    return this.wordsService.getWords();
  }

  @Post()
  createWord(@Body() body: CreateWordDto) {
    return this.wordsService.createWord(
      body.entry,
      body.showEntry,
      body.level,
      body.pron,
    );
  }
}

const req: CreateWordDto = {
  entry: '人',
  showEntry: 'ひと',
  level: 5,
  pron: '人',
};
