import { Controller, Post, Get, Body } from '@nestjs/common';
import { SecaoService } from './secao.service';
import { CreateSecaoDto } from './dto/create-secao.dto';
import { Secao } from './secao.entity';

@Controller('secoes')
export class SecaoController {
  constructor(private readonly secaoService: SecaoService) {}

  @Post()
  async criar(@Body() createSecaoDto: CreateSecaoDto): Promise<Secao> {
    return this.secaoService.criar(createSecaoDto);
  }

  @Get()
  async listar(): Promise<Secao[]> {
    return this.secaoService.listar();
  }
}
