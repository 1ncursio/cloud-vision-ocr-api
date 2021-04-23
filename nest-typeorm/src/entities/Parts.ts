import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Index('name', ['name'], { unique: true })
@Entity({ schema: 'ocr', name: 'parts' })
export class Parts {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: 8 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

const arr = [
  '전체',
  '명사',
  '대명사',
  '동사',
  '조사',
  '형용사',
  '접사',
  '부사',
  '감동사',
  '형용동사',
  '기타',
];
