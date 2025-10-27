import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './usuario.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './usuario.entity'; 

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    return this.usersService.validateUser(createUserDto);
  }

  @Get()
  async listarTodos(): Promise<User[]> {
    return this.usersService.listarTodos();
  }

  @Get('email/:email')
  async buscarPorEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.buscarPorEmail(email);
  }
}