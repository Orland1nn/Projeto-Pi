import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { Produto } from './produto.entity';

@Controller('products')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  async criar(@Body() createProdutoDto: CreateProdutoDto): Promise<Produto> {
    return this.produtoService.criar(createProdutoDto);
  }

  @Get('listar')
  async listar(): Promise<Produto[]> {
    return this.produtoService.listar();
  }

  @Put('atualizar/:id')
  async atualizar(
    @Param('id') id: string,
    @Body() dados: Partial<CreateProdutoDto>,
  ): Promise<Produto> {
    return this.produtoService.atualizarPorId(Number(id), dados);
  }

  @Delete('remover/:nome')
  async remover(@Param('nome') nome: string): Promise<void> {
    return this.produtoService.removerPorNome(nome);
  }
}
