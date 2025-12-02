import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Pedido } from '../pedido/pedido.entity';

@Entity()
export class Pagamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string; // 'pix', 'cartao', 'dinheiro', etc.

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @ManyToOne(() => Pedido, pedido => pedido.pagamentos, { onDelete: 'CASCADE' })
  pedido: Pedido;
}
