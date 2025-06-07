import { Module } from '@nestjs/common';
import { TypeOrmTickRepository } from './repositories/typeorm-tick.repository';
import { DatabaseType } from '../common/repositories/base.repository.interface';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'TickRepositoryInterface',
      useFactory: () => {
        // This will be updated once Agent 1 completes database configuration
        const options = { databaseType: DatabaseType.SQL };
        return new TypeOrmTickRepository(options);
      },
    },
  ],
  exports: ['TickRepositoryInterface'],
})
export class TicksModule {}