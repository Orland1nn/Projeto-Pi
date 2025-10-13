import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
  ) {}

  async criar(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const produto = this.produtoRepository.create(createProdutoDto);
    return await this.produtoRepository.save(produto);
  }

  async listar(): Promise<Produto[]> {
    return await this.produtoRepository.find();
  }
  async listarTodos(): Promise<Produto[]> {
    return this.produtoRepository.find();
  }

  async listarPorCategoria(categoria: string): Promise<Produto[]> {
    return this.produtoRepository.find({
      where: { tipo: categoria },
    });
  }
  
  async atualizarPorId(
    id: number,
    dados: Partial<CreateProdutoDto>,
  ): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({ where: { id } });
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    Object.assign(produto, dados);
    return this.produtoRepository.save(produto);
  }

  async removerPorNome(nome: string): Promise<void> {
    const produto = await this.produtoRepository.findOne({ where: { nome } });
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }
    await this.produtoRepository.remove(produto);
  }
}
