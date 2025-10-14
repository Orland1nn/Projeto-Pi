import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Produto } from '../produto/produto.entity';

@Entity('secoes')
export class Secao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // nome deve ser único
  nome: string;

  @OneToMany(() => Produto, (produto) => produto.secao)
  produtos: Produto[];
}
