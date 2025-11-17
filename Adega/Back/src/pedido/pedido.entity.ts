import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PedidoItem } from './pedido-item.entity';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  formaPagamento: string;

  @Column()
  status: string;

  @Column('int')
  totalItens: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precoTotal: number;

  @OneToMany(() => PedidoItem, (item) => item.pedido, { cascade: true })
  itens: PedidoItem[];
}
