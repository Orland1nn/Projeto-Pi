import { CartItemDto } from './cart-item.dto';

export class CartDto {
  items: CartItemDto[];
  total: number;
}
