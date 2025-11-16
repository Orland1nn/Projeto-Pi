import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './pedido.entity';
import { PedidoController } from './pedido.controller';
import { PedidoService } from './pedido.service';
import { ProdutoModule } from '../produto/produto.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido]),
    ProdutoModule, 
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}