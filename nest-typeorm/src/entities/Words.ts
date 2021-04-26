import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'ocr', name: 'words' })
export class Words {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'entry', unique: true, length: 8 })
  entry: string; // 일본어

  @Column('varchar', { name: 'showEntry', unique: true, length: 10 })
  showEntry: string; // 후리가나-오쿠리가나 표기

  @Column('tinyint', { name: 'level' })
  level: number; // JLPT 급수

  // parts[] 배열 품사

  @Column('varchar', { name: 'pron', length: 10 }) // 한자포함 표기
  pron: string;

  // means[] 배열 의미

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @ManyToMany(() => {  })
}
