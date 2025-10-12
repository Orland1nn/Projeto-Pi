import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secao } from './secao.entity';
import { SecaoService } from './secao.service';
import { SecaoController } from './secao.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Secao])],
  controllers: [SecaoController],
  providers: [SecaoService],
})
export class SecaoModule {}
