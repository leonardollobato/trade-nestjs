import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';
import { TickInterval } from '../entities/tick.entity';

export class CreateTickDto {
  @IsNotEmpty()
  @IsUUID()
  stockId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  volume: number;

  @IsNotEmpty()
  @IsDateString()
  timestamp: string;

  @IsNotEmpty()
  @IsEnum(TickInterval)
  interval: TickInterval;
}