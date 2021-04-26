import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @Get()
  // getUsers(@Req() req) {
  //   return req.user;
  // }

  @Get()
  getUsers(@Req() req) {
    return this.usersService.getUsers();
  }

  @Post()
  postUsers(@Body() data: JoinRequestDto) {
    return this.usersService.postUsers(
      data.email,
      data.nickname,
      data.password,
    );
  }
}
