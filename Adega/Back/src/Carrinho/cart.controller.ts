import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart() {
    return this.cartService.getCart();
  }

  @Post('add/:id')
  async addItem(@Param('id') id: string, @Body() body: { quantidade: number }) {
    return this.cartService.addItem(Number(id), body.quantidade || 1);
  }

  @Patch('update/:id')
  async updateItem(
    @Param('id') id: string,
    @Body() body: { quantidade: number },
  ) {
    return this.cartService.updateQuantity(Number(id), body.quantidade);
  }

  @Delete('remove/:id')
  async removeItem(@Param('id') id: string) {
    return this.cartService.removeItem(Number(id));
  }

  @Delete('clear')
  clearCart() {
    this.cartService.clearCart();
    return { message: 'Carrinho limpo' };
  }
}
