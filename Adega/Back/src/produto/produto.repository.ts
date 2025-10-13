import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Produto } from './produto.entity';

@Injectable()
export class ProdutoRepository extends Repository<Produto> {
  constructor(private dataSource: DataSource) {
    super(Produto, dataSource.createEntityManager());
  }

  async findByTipo(tipo: string): Promise<Produto[]> {
    return this.find({ where: { tipo } });
  }
}
