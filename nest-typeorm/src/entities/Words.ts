import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'test', name: 'words' })
export class Words {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'entry', unique: true, length: 8 })
  entry: string; // 일본어

  @Column('varchar', { name: 'show_entry', unique: true, length: 10 })
  show_entry: string; // 후리가나-오쿠리가나 표기

  japanese: string;

  @Column('tinyint', { name: 'level' })
  level: number; // JLPT 급수

  @CreateDateColumn()
  createdAt: Date;
}
