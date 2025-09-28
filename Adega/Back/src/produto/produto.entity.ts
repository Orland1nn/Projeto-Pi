import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  tipo: string;

  @Column('decimal')
  preco: number;

  @Column()
  imagem: string;
}
