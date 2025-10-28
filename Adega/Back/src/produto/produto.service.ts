import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { Secao } from 'src/secao/secao.entity';
import { UpdateQuantidadeDto } from './dto/update-quantidade.dto';


@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,

    @InjectRepository(Secao)
    private secaoRepository: Repository<Secao>,
  ) {}

  async criar(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const secao = await this.secaoRepository.findOne({
      where: { nome: createProdutoDto.tipo },
    });

    if (!secao) {
      throw new NotFoundException(
        `A seção '${createProdutoDto.tipo}' não existe.`,
      );
    }

    const produto = this.produtoRepository.create({
      ...createProdutoDto,
      secao,
    });

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

  async buscarPorNome(nome: string): Promise<Produto> {
  const produto = await this.produtoRepository.findOne({
    where: { nome },
  });

  if (!produto) {
    throw new NotFoundException(`Produto com nome "${nome}" não encontrado.`);
  }

  return produto;
  }

  async listarTop5PorQuantidade(): Promise<Produto[]> {
  return await this.produtoRepository.find({
    order: { quantidade: 'DESC' },
    take: 5,
  });
  }

  async aumentarQuantidade(data: UpdateQuantidadeDto) {
  const { id, nome, quantidade } = data;

  const produto = await this.produtoRepository.findOne({
    where: id ? { id } : { nome },
  });

  if (!produto) {
    throw new Error('Produto não encontrado');
  }

  produto.quantidade += quantidade;
  return this.produtoRepository.save(produto);
}

async diminuirQuantidade(data: UpdateQuantidadeDto) {
  const { id, nome, quantidade } = data;

  const produto = await this.produtoRepository.findOne({
    where: id ? { id } : { nome },
  });

  if (!produto) {
    throw new Error('Produto não encontrado');
  }

  if (produto.quantidade < quantidade) {
    throw new Error('Quantidade insuficiente em estoque');
  }

  produto.quantidade -= quantidade;
  return this.produtoRepository.save(produto);
}

}
