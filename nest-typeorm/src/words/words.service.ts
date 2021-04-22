import { Injectable } from '@nestjs/common';
import { Words } from '../entities/Words';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Words)
    private wordsRepository: Repository<Words>,
  ) {}

  async getWords() {
    return await this.wordsRepository.find();
  }
}
