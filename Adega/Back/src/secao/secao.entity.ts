import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('secoes')
export class Secao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;
}
