import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './produto.entity';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { ProdutoRepository } from './produto.repository';
import { Secao } from 'src/secao/secao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, Secao])],
  controllers: [ProdutoController],
  providers: [ProdutoService, ProdutoRepository],
  exports: [ProdutoService],
})
export class ProdutoModule {}
