import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Secao } from '../secao/secao.entity';
import { PedidoItem } from '../pedido/pedido-item.entity';

@Entity('products')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  tipo: string;

  @Column('decimal', { precision: 10, scale: 2 })
  preco: number;

  @Column()
  imagem: string;

  @Column({ type: 'int', default: 0 })
  quantidade: number;

  @ManyToOne(() => Secao, (secao) => secao.produtos, { eager: true })
  @JoinColumn({ name: 'tipo', referencedColumnName: 'nome' })
  secao: Secao;

  @OneToMany(() => PedidoItem, (item) => item.produto)
  itens: PedidoItem[];
}
