import { TickInterval } from '../../ticks/entities/tick.entity';

export interface TickIntervalConfig {
  value: TickInterval;
  label: string;
  milliseconds: number;
  isDefault: boolean;
}

export interface OHLCData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MovingAverageData {
  timestamp: Date;
  average: number;
}

export interface TickGenerationOptions {
  volatility?: number;
  trendBias?: number;
  volumeMultiplier?: number;
  respectMarketHours?: boolean;
}

export type TickGeneratorCallback = (tick: any) => void;