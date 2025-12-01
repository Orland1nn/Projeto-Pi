import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProdutoModule } from '../produto/produto.module'; // necessário porque o cart usa ProdutoService

@Module({
  imports: [ProdutoModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
