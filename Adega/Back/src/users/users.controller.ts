import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // Validação da senha
    if (createUserDto.password.length < 8) {
      throw new BadRequestException('A senha deve conter mais de oito caracteres.');
    }
    // Validação do e-mail único
    const exists = await this.usersService.findByEmail(createUserDto.email);
    if (exists) {
      throw new BadRequestException('E-mail já cadastrado.');
    }
    return this.usersService.create(createUserDto);
  }
}
