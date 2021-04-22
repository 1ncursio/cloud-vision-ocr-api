import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/Users';
import { WordsController } from './words/words.controller';
import { WordsService } from './words/words.service';
import { WordsModule } from './words/words.module';
import { Words } from './entities/Words';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'nodejsbook',
      database: 'test',
      entities: [Users, Words],
      autoLoadEntities: true,
      synchronize: true,
      charset: 'utf8mb4',
    }),
    UsersModule,
    WordsModule,
  ],
})
export class AppModule {}
