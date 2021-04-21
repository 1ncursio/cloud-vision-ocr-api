import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Words {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  korean: string;

  japanese: string;

  level: number;
}
