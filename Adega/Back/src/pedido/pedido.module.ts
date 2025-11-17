import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './pedido.entity';
import { PedidoItem } from './pedido-item.entity';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { Produto } from '../produto/produto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, PedidoItem, Produto])],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
