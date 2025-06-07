import { Stock } from '../entities/stock.entity';
import { CreateStockDto } from '../dto/create-stock.dto';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { StockFilterDto } from '../dto/stock-filter.dto';

export interface StockRepositoryInterface {
  create(createStockDto: CreateStockDto): Promise<Stock>;
  findAll(filterDto: StockFilterDto): Promise<Stock[]>;
  findOne(id: string): Promise<Stock>;
  findOneBySymbol(symbol: string): Promise<Stock>;
  update(id: string, updateStockDto: UpdateStockDto): Promise<Stock>;
  remove(id: string): Promise<void>;
  
  // Specialized queries
  findBySector(sector: string): Promise<Stock[]>;
  findByIndex(index: string): Promise<Stock[]>;
  findByMarketCapRange(min: number, max?: number): Promise<Stock[]>;
  searchByName(query: string): Promise<Stock[]>;
  
  // Stats and aggregation
  countBySector(): Promise<{ sector: string; count: number }[]>;
  getAveragePrice(): Promise<number>;
}