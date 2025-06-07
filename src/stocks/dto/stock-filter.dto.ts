import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StockIndex, StockSector } from '../entities/stock.entity';

export class StockFilterDto {
  @IsOptional()
  @IsEnum(StockSector)
  sector?: StockSector;

  @IsOptional()
  @IsEnum(StockIndex)
  index?: StockIndex;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'symbol' | 'marketCap' | 'currentPrice' | 'volumeAverage';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}