import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './usuario.service';
import { CreateUserDto } from '././dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}