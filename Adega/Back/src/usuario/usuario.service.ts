import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './usuario.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { nome, email, senha } = createUserDto;

    const userExists = await this.usersRepository.findOne({ where: { email } });
    if (userExists) {
      throw new BadRequestException('E-mail já está em uso');
    }
    
    console.log('Senha recebida:', senha);
    const hashedPassword = await bcrypt.hash(createUserDto.senha, 10);

    const user = this.usersRepository.create({
      nome,
      email,
      senha: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

   async validateUser(createUserDto: CreateUserDto ): Promise<any> {
    const { email, senha } = createUserDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      message: 'Login realizado com sucesso!',
      userId: user.id,
      email: user.email,
      nome: user.nome
    };
  }
}