import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = {
      id: this.idCounter++,
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password, // Em produção, faça hash da senha!
    };
    this.users.push(user);
    return user;
  }
}
