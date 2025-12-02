import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PedidoItem } from './pedido-item.entity';
import { Pagamento } from '../pagamento/pagamento.entity';

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

  @OneToMany(() => Pagamento, pagamento => pagamento.pedido, {
  cascade: true,
})
pagamentos: Pagamento[];

}
