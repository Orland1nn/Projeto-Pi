import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Secao } from './secao.entity';

@Injectable()
export class SecaoRepository extends Repository<Secao> {
  constructor(private dataSource: DataSource) {
    super(Secao, dataSource.createEntityManager());
  }

 
}
