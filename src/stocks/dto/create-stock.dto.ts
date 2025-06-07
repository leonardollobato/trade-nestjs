import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';
import { StockIndex, StockSector } from '../entities/stock.entity';

export class CreateStockDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(10)
  symbol: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  companyName: string;

  @IsEnum(StockSector)
  sector: StockSector;

  @IsEnum(StockIndex)
  index: StockIndex;

  @IsNumber()
  @IsPositive()
  marketCap: number;

  @IsNumber()
  @IsPositive()
  volumeAverage: number;

  @IsNumber()
  @IsPositive()
  currentPrice: number;
}