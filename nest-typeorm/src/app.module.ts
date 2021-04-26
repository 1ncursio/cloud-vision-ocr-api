import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Users } from './entities/Users';
import { WordsModule } from './words/words.module';
import { Words } from './entities/Words';
import { Parts } from './entities/Parts';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Users, Words, Parts],
      autoLoadEntities: true,
      synchronize: true,
      charset: 'utf8mb4',
    }),
    UsersModule,
    WordsModule,
  ],
})
export class AppModule {}
