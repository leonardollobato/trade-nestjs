import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tick } from '../../ticks/entities/tick.entity';

export enum StockSector {
  TECHNOLOGY = 'Technology',
  HEALTHCARE = 'Healthcare',
  FINANCE = 'Finance',
  CONSUMER = 'Consumer',
  ENERGY = 'Energy',
  INDUSTRIAL = 'Industrial',
  MATERIALS = 'Materials',
  UTILITIES = 'Utilities',
  REAL_ESTATE = 'Real Estate',
  COMMUNICATION = 'Communication',
}

export enum StockIndex {
  SP500 = 'S&P 500',
  NASDAQ = 'NASDAQ',
  DOW_JONES = 'Dow Jones',
}

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  symbol: string;

  @Column()
  companyName: string;

  @Column({
    type: 'enum',
    enum: StockSector,
  })
  sector: StockSector;

  @Column({
    type: 'enum',
    enum: StockIndex,
  })
  index: StockIndex;

  @Column('decimal', { precision: 15, scale: 2 })
  marketCap: number;

  @Column('decimal', { precision: 15, scale: 2 })
  volumeAverage: number;

  @Column('decimal', { precision: 10, scale: 4 })
  currentPrice: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Tick, (tick) => tick.stock)
  ticks: Tick[];
}