import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
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

  async testInsert() {
    const user = this.usersRepository.create({ nome: 'teste' });
    const saved = await this.usersRepository.save(user);
    console.log('SALVO:', saved);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { nome, email, senha } = createUserDto;

    const userExists = await this.usersRepository.findOne({ where: { email } });
    if (userExists) {
      throw new BadRequestException('E-mail já está em uso');
    }

    console.log('Senha recebida:', senha);
    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = this.usersRepository.create({
      nome,
      email,
      senha: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async validateUser(createUserDto: CreateUserDto): Promise<any> {
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
      nome: user.nome,
    };
  }

  async listarTodos(): Promise<User[]> {
    const usuarios = await this.usersRepository.find();
    if (!usuarios.length) {
      throw new NotFoundException('Nenhum usuário encontrado.');
    }
    return usuarios;
  }

  async buscarPorEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
    throw new NotFoundException(`Usuário com e-mail "${email}" não encontrado.`);
  }
    return user;
  }
}