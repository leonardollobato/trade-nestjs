import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from '../entities/stock.entity';
import { StockRepositoryInterface } from './stock.repository.interface';
import { CreateStockDto } from '../dto/create-stock.dto';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { StockFilterDto } from '../dto/stock-filter.dto';
import { RepositoryOptions } from '../../common/repositories/base.repository.interface';

/**
 * Mock implementation of TypeORM stock repository
 * This is a placeholder until Agent 1 completes the database setup (SI-3)
 */
@Injectable()
export class TypeOrmStockRepository implements StockRepositoryInterface {
  constructor(
    // @InjectRepository(Stock) private stockRepository: Repository<Stock>,
    private options: RepositoryOptions = {},
  ) {}

  async create(createStockDto: CreateStockDto): Promise<Stock> {
    console.log('Mock TypeOrmStockRepository.create called', createStockDto);
    const stock = new Stock();
    Object.assign(stock, createStockDto);
    stock.id = Math.random().toString(36).substring(2, 15);
    stock.createdAt = new Date();
    stock.updatedAt = new Date();
    return stock;
  }

  async findAll(filterDto: StockFilterDto): Promise<Stock[]> {
    console.log('Mock TypeOrmStockRepository.findAll called', filterDto);
    return [];
  }

  async findOne(id: string): Promise<Stock> {
    console.log('Mock TypeOrmStockRepository.findOne called', id);
    const stock = new Stock();
    stock.id = id;
    return stock;
  }

  async findOneBySymbol(symbol: string): Promise<Stock> {
    console.log('Mock TypeOrmStockRepository.findOneBySymbol called', symbol);
    const stock = new Stock();
    stock.symbol = symbol;
    return stock;
  }

  async update(id: string, updateStockDto: UpdateStockDto): Promise<Stock> {
    console.log('Mock TypeOrmStockRepository.update called', id, updateStockDto);
    const stock = new Stock();
    stock.id = id;
    Object.assign(stock, updateStockDto);
    stock.updatedAt = new Date();
    return stock;
  }

  async remove(id: string): Promise<void> {
    console.log('Mock TypeOrmStockRepository.remove called', id);
  }

  async findBySector(sector: string): Promise<Stock[]> {
    console.log('Mock TypeOrmStockRepository.findBySector called', sector);
    return [];
  }

  async findByIndex(index: string): Promise<Stock[]> {
    console.log('Mock TypeOrmStockRepository.findByIndex called', index);
    return [];
  }

  async findByMarketCapRange(min: number, max?: number): Promise<Stock[]> {
    console.log('Mock TypeOrmStockRepository.findByMarketCapRange called', min, max);
    return [];
  }

  async searchByName(query: string): Promise<Stock[]> {
    console.log('Mock TypeOrmStockRepository.searchByName called', query);
    return [];
  }

  async countBySector(): Promise<{ sector: string; count: number }[]> {
    console.log('Mock TypeOrmStockRepository.countBySector called');
    return [];
  }

  async getAveragePrice(): Promise<number> {
    console.log('Mock TypeOrmStockRepository.getAveragePrice called');
    return 0;
  }
}