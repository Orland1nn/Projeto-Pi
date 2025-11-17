import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './pedido.entity';
import { PedidoItem } from './pedido-item.entity';
import { Produto } from '../produto/produto.entity';
import { CreatePedidoComItensDto } from './dto/create-pedido-com-itens.dto';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,

    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
  ) {}

  async criar(dto: CreatePedidoComItensDto): Promise<Pedido> {
    const pedido = this.pedidoRepository.create({
      formaPagamento: dto.formaPagamento,
      status: dto.status,
      precoTotal: 0,
      totalItens: 0,
    });

    let precoTotal = 0;
    let totalItens = 0;
    const itens: PedidoItem[] = [];

    for (const itemDto of dto.itens) {
      const produto = await this.produtoRepository.findOne({
        where: { id: itemDto.produtoId },
      });

      if (!produto) {
        throw new NotFoundException(
          `Produto ${itemDto.produtoId} não encontrado.`,
        );
      }

      if (produto.quantidade < itemDto.quantidade) {
        throw new BadRequestException(
          `Estoque insuficiente do produto ${produto.nome}. Disponível: ${produto.quantidade}`,
        );
      }

      const subtotal = Number(produto.preco) * itemDto.quantidade;
      precoTotal += subtotal;
      totalItens += itemDto.quantidade;

      produto.quantidade -= itemDto.quantidade;
      await this.produtoRepository.save(produto);

      const item = new PedidoItem();
      item.produto = produto;
      item.quantidade = itemDto.quantidade;
      item.precoUnitario = produto.preco;
      item.subtotal = subtotal;

      itens.push(item);
    }

    pedido.precoTotal = precoTotal;
    pedido.totalItens = totalItens;
    pedido.itens = itens;

    return this.pedidoRepository.save(pedido);
  }
}
