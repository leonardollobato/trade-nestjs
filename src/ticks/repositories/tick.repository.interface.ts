import { Tick, TickInterval } from '../entities/tick.entity';
import { CreateTickDto } from '../dto/create-tick.dto';
import { TickQueryDto } from '../dto/tick-query.dto';

export interface TickRepositoryInterface {
  create(createTickDto: CreateTickDto): Promise<Tick>;
  createMany(createTickDtos: CreateTickDto[]): Promise<Tick[]>;
  
  // Time-series queries
  findAll(tickQueryDto: TickQueryDto): Promise<Tick[]>;
  findOne(id: string): Promise<Tick>;
  findLatestByStock(stockId: string, interval?: TickInterval): Promise<Tick>;
  findByTimeRange(stockId: string, from: Date, to: Date, interval?: TickInterval): Promise<Tick[]>;
  
  // Aggregation queries
  getOHLC(stockId: string, from: Date, to: Date, interval: TickInterval): Promise<{
    timestamp: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[]>;
  
  getMovingAverage(stockId: string, days: number, endDate?: Date): Promise<{
    timestamp: Date;
    average: number;
  }[]>;
  
  // Data management
  removeOlderThan(date: Date): Promise<number>;
  countByStockAndInterval(stockId: string, interval: TickInterval): Promise<number>;
}