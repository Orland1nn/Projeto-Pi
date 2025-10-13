import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secao } from './secao.entity';
import { SecaoService } from './secao.service';
import { SecaoController } from './secao.controller';
import { SecaoRepository } from './secao.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Secao])],
  controllers: [SecaoController],
  providers: [SecaoService,SecaoRepository],
  exports: [SecaoRepository],
})
export class SecaoModule {}
