import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Secao } from './secao.entity';
import { CreateSecaoDto } from './dto/create-secao.dto';

@Injectable()
export class SecaoService {
  constructor(
    @InjectRepository(Secao)
    private readonly secaoRepository: Repository<Secao>,
  ) {}

  async criar(createSecaoDto: CreateSecaoDto): Promise<Secao> {
    const secao = this.secaoRepository.create(createSecaoDto);
    return this.secaoRepository.save(secao);
  }

  async listar(): Promise<Secao[]> {
    return this.secaoRepository.find();
  }
}
