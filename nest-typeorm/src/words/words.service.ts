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

  async createWord(
    entry: string,
    showEntry: string,
    level: number,
    pron: string,
  ) {
    const exWord = await this.wordsRepository.findOne({ where: { entry } });
    if (exWord) return false;

    const word = await this.wordsRepository.save({
      entry,
      showEntry,
      level,
      pron,
    });

    console.log(word);

    return true;
  }
}
