import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './produto.entity';
import { Secao } from '../secao/secao.entity';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, Secao])],
  controllers: [ProdutoController],
  providers: [ProdutoService],
  exports: [
    TypeOrmModule.forFeature([Produto, Secao]), 
    ProdutoService, 
  ],
})
export class ProdutoModule {}