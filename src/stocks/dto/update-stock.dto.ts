import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';
import { StockIndex, StockSector } from '../entities/stock.entity';

export class UpdateStockDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  symbol?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  companyName?: string;

  @IsOptional()
  @IsEnum(StockSector)
  sector?: StockSector;

  @IsOptional()
  @IsEnum(StockIndex)
  index?: StockIndex;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  marketCap?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  volumeAverage?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  currentPrice?: number;

  @IsOptional()
  isActive?: boolean;
}