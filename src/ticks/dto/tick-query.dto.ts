import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TickInterval } from '../entities/tick.entity';

export class TickQueryDto {
  @IsOptional()
  @IsUUID()
  stockId?: string;

  @IsOptional()
  @IsEnum(TickInterval)
  interval?: TickInterval;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'timestamp' | 'price' | 'volume';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  offset?: string;
}