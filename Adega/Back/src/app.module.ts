import { Module, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProdutoModule } from './produto/produto.module';
import { SecaoModule } from './secao/secao.module';
import { UsersModule } from './usuario/usuario.module';

@Injectable()
class DatabaseMonitor implements OnModuleInit {
  private readonly logger = new Logger('Database');

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    // If already initialized, just log. Otherwise wait for initialization.
    try {
      if (this.dataSource.isInitialized) {
        this.logger.log('✅ Conectado ao banco de dados com sucesso!');
      } else {
        await this.dataSource.initialize();
        this.logger.log('✅ Conectado ao banco de dados com sucesso!');
      }
    } catch (err) {
      this.logger.error('❌ Falha ao conectar ao banco de dados', err as any);
    }
  }
}

@Module({
  imports: [
    // Carrega variáveis do .env
    ConfigModule.forRoot({
      isGlobal: true, // Disponível em toda a aplicação
    }),

    // Configura conexão com o banco usando variáveis do .env
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT ?? '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: true,
        logging: true,

        /* type: 'postgres',
        host: '127.0.0.1',
        port: 5432,
        username: 'postgres',
        password: '912718',
        database: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        logging: true, */

        /*type: 'postgres',
        host: '127.0.0.1',
        port: 5433,
        username: 'postgres',
        password: '12345678',
        database: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        logging: true, */



        // type: 'postgres',
        // host: '127.0.0.1',
        // port: 5434,
        // username: 'postgres',
        // password: 'iphone16pro',
        // database: 'postgres',
        // autoLoadEntities: true,
        // synchronize: true,
        // logging: true,


      }),
    }),
    ProdutoModule,
    SecaoModule,
    UsersModule,
  ],
  providers: [DatabaseMonitor],
})
export class AppModule {}
