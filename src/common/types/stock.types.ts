import { StockIndex, StockSector } from '../../stocks/entities/stock.entity';

export interface StockSummary {
  id: string;
  symbol: string;
  companyName: string;
  currentPrice: number;
  sector: StockSector;
  index: StockIndex;
}

export interface StockSectorSummary {
  sector: StockSector;
  stockCount: number;
  averagePrice: number;
  totalMarketCap: number;
}

export interface StockIndexSummary {
  index: StockIndex;
  stockCount: number;
  averagePrice: number;
  totalMarketCap: number;
}

export interface StockPriceHistory {
  symbol: string;
  data: {
    date: Date;
    price: number;
    volume: number;
  }[];
}