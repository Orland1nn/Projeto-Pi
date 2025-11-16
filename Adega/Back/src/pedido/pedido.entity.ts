import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Produto } from '../produto/produto.entity';
import { User } from '../usuario/usuario.entity';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: Date;

  @Column('int')
  quantidade: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precoTotal: number;

  @ManyToOne(() => Produto, (produto) => produto.pedidos)
  @JoinColumn({ name: 'produtoId' })
  produto: Produto;

  @ManyToOne(() => User, (user) => user.pedidos)
  @JoinColumn({ name: 'userId' })
  usuario: User;

  @Column()
  formaPagamento: string;
}