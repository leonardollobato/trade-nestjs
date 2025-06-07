import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StocksModule } from './stocks/stocks.module';
import { TicksModule } from './ticks/ticks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StocksModule,
    TicksModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}