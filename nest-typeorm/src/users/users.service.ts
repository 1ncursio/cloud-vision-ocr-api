import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async getUsers() {
    return await this.usersRepository.find();
  }

  async postUsers(email: string, nickname: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 12);

    const exUser = await this.usersRepository.findOne({ where: { email } });
    if (exUser) return false;

    await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
    return true;
  }
}
