import { Module, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProdutoModule } from './produto/produto.module';
import { SecaoModule } from './secao/secao.module';
import { UsersModule } from './usuario/usuario.module';
import { PedidoModule } from './pedido/pedido.module';
import { Secao } from './secao/secao.entity';

@Injectable()
export class DatabaseMonitor implements OnModuleInit {
  private readonly logger = new Logger('Database');

  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Secao)
    private readonly secaoRepository: Repository<Secao>,
  ) { }

  async onModuleInit() {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }

      this.logger.log('✅ Conectado ao banco de dados!');

      // 🔍 Verificar se tabela "secoes" está vazia
      const count = await this.secaoRepository.count();

      if (count === 0) {
        this.logger.warn(
          '⚠️ Tabela "secoes" vazia. Inserindo valores padrão...',
        );

        await this.secaoRepository.insert([
          { nome: 'Vinhos' },
          { nome: 'Cervejas' },
          { nome: 'Whisky' },
          { nome: 'Vodkas' },
          { nome: 'Energéticos' },
        ]);

        this.logger.log('✅ Tabela "secoes" populada com valores iniciais!');
      } else {
        this.logger.log(`📦 A tabela "secoes" possui ${count} registro(s).`);
      }
    } catch (err) {
      this.logger.error('❌ Erro ao iniciar conexão com DB', err as any);
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
        /*
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT ?? '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: true,
        logging: true, */

        /*type: 'postgres',
        host: '127.0.0.1',
        port: 5432,
        username: 'postgres',
        password: '912718',
        database: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        logging: true,*/

        type: 'postgres',
        host: '127.0.0.1',
        port: 5433,
        username: 'postgres',
        password: '12345678',
        database: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
<<<<<<< HEAD
        logging: true, */
        
=======
        logging: true,
        /*
>>>>>>> 6fd88c00a9a5b2214f4f21f74a1cdd739e985288
        type: 'postgres',
        host: '127.0.0.1',
        port: 5434,
        username: 'postgres',
        password: 'iphone16pro',
        database: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        
      }),
    }),
    ProdutoModule,
    SecaoModule,
    UsersModule,
    PedidoModule,
  ],
  providers: [DatabaseMonitor],
})
export class AppModule { }
