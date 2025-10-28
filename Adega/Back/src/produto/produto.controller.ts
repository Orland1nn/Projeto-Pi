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
import { UpdateQuantidadeDto } from './dto/update-quantidade.dto';

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

  @Get('top5')
  async listarTop5PorQuantidade(): Promise<Produto[]> {
    return this.produtoService.listarTop5PorQuantidade();
  }

   @Put('aumentar')
  aumentar(@Body() data: UpdateQuantidadeDto) {
    return this.produtoService.aumentarQuantidade(data);
  }

  @Put('diminuir')
  diminuir(@Body() data: UpdateQuantidadeDto) {
  return this.produtoService.diminuirQuantidade(data);
}

}
