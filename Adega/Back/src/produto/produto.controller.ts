import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
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

  @Get()
  async listar(@Query('categoria') categoria?: string) {
    if (categoria) {
      return this.produtoService.listarPorCategoria(categoria);
    }
    return this.produtoService.listarTodos();
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

  @Get('nome/:nome')
  async buscarPorNome(@Param('nome') nome: string): Promise<Produto> {
    return this.produtoService.buscarPorNome(nome);
  }

}
