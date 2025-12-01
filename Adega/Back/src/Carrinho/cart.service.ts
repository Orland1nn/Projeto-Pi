import { Injectable, NotFoundException } from '@nestjs/common';
import { ProdutoService } from 'src/produto/produto.service';
import { CartDto } from './dto/cart.dto';
import { CartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
  private cart: CartItemDto[] = [];

  constructor(private produtoService: ProdutoService) {}

  getCart(): CartDto {
    const total = this.cart.reduce((acc, item) => acc + item.subtotal, 0);
    return { items: this.cart, total };
  }

  // Adiciona item ao carrinho
  async addItem(produtoId: number, quantidade = 1): Promise<CartDto> {
    const produto = await this.produtoService.atualizarPorId(produtoId, {});
    if (!produto) throw new NotFoundException('Produto não encontrado');

    const existingItem = this.cart.find(
      (item) => item.produtoId === produto.id,
    );

    if (existingItem) {
      existingItem.quantidade += quantidade;
      existingItem.subtotal = Number(
        existingItem.quantidade * existingItem.precoUnitario,
      );
    } else {
      this.cart.push({
        produtoId: produto.id,
        nome: produto.nome,
        precoUnitario: Number(produto.preco),
        quantidade,
        subtotal: Number(produto.preco) * quantidade,
        imagem: produto.imagem || '/images/default.png',
      });
    }

    return this.getCart();
  }

  removeItem(produtoId: number): CartDto {
    this.cart = this.cart.filter((item) => item.produtoId !== produtoId);
    return this.getCart();
  }

  updateQuantity(produtoId: number, quantidade: number): CartDto {
    const item = this.cart.find((item) => item.produtoId === produtoId);
    if (!item) throw new NotFoundException('Produto não está no carrinho');

    item.quantidade = quantidade;
    item.subtotal = Number(item.precoUnitario * quantidade);

    if (item.quantidade <= 0) {
      this.removeItem(produtoId);
    }

    return this.getCart();
  }

  clearCart(): void {
    this.cart = [];
  }
}
