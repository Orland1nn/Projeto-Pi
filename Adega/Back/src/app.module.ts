import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './usuario/usuario.module';
import { ProdutoModule } from './produto/produto.module';
import { SecaoModule } from './secao/secao.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    ProdutoModule,
    SecaoModule,
  ],
})
export class AppModule {}
