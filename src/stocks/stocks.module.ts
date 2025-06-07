import { Module } from '@nestjs/common';
import { TypeOrmStockRepository } from './repositories/typeorm-stock.repository';
import { DatabaseType } from '../common/repositories/base.repository.interface';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'StockRepositoryInterface',
      useFactory: () => {
        // This will be updated once Agent 1 completes database configuration
        const options = { databaseType: DatabaseType.SQL };
        return new TypeOrmStockRepository(options);
      },
    },
  ],
  exports: ['StockRepositoryInterface'],
})
export class StocksModule {}