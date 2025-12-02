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
import { Pagamento } from './pagamento.entity';
import { CreatePedidoComItensDto } from './dto/create-pedido-com-itens.dto';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,

    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,

    @InjectRepository(Pagamento)
    private pagamentoRepository: Repository<Pagamento>,
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

    // -----------------------------
    // 1) PROCESSAR ITENS
    // -----------------------------
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

    // -----------------------------
    // 2) VALIDAR PAGAMENTOS
    // -----------------------------
    const somaPagamentos =
      dto.pagamentos?.reduce((acc, p) => acc + Number(p.valor), 0) ?? 0;

    if (somaPagamentos !== precoTotal) {
      throw new BadRequestException(
        `A soma dos pagamentos (${somaPagamentos}) deve ser igual ao total do pedido (${precoTotal}).`,
      );
    }

    // -----------------------------
    // 3) CRIAR PAGAMENTOS
    // -----------------------------
    const pagamentos: Pagamento[] = dto.pagamentos.map((pDto) => {
      const pagamento = new Pagamento();
      pagamento.tipo = pDto.tipo;
      pagamento.valor = pDto.valor;
      pagamento.pedido = pedido;
      return pagamento;
    });

    pedido.pagamentos = pagamentos;

    // -----------------------------
    // 4) SALVAR PEDIDO COMPLETO
    // -----------------------------
    return this.pedidoRepository.save(pedido);
  }

  async listarTodos(): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      relations: {
        itens: { produto: true },
        pagamentos: true,
      },
      order: { id: 'DESC' },
    });
  }

  async buscarPorId(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
      relations: {
        itens: { produto: true },
        pagamentos: true,
      },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
    }

    return pedido;
  }
}
