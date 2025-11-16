import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './pedido.entity';
import { CreatePedidoComItensDto } from './dto/create-pedido-com-itens.dto';
import { Produto } from '../produto/produto.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
  ) {}

  async criar(createPedidoDto: CreatePedidoComItensDto): Promise<Pedido> {
    let precoTotal = 0;

    for (const item of createPedidoDto.itens) {
      const produto = await this.produtoRepository.findOne({ where: { id: item.produtoId } });
      if (!produto) {
        throw new NotFoundException(`Produto com ID ${item.produtoId} não encontrado.`);
      }
      precoTotal += produto.preco * item.quantidade;
    }

    const pedido = this.pedidoRepository.create({
      data: createPedidoDto.data,
      formaPagamento: createPedidoDto.formaPagamento,
      precoTotal,
    });

    const savedPedido = await this.pedidoRepository.save(pedido);

    return savedPedido;
  }
}