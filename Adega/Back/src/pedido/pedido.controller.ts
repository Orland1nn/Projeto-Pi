import { Controller, Post, Get, Body } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { Pedido } from './pedido.entity';
import { CreatePedidoComItensDto } from './dto/create-pedido-com-itens.dto';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  async criar(
    @Body() createPedidoDto: CreatePedidoComItensDto,
  ): Promise<Pedido> {
    return this.pedidoService.criar(createPedidoDto);
  }

  @Get()
  listarTodos() {
    return this.pedidoService.listarTodos();
  }

}