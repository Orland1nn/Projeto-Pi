import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Secao } from '../secao/secao.entity';

@Entity('products')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  tipo: string; // será usado como chave da relação

  @Column('decimal')
  preco: number;

  @Column()
  imagem: string;

  @ManyToOne(() => Secao, (secao) => secao.produtos, { eager: true })
  @JoinColumn({ name: 'tipo', referencedColumnName: 'nome' })
  secao: Secao;
}
