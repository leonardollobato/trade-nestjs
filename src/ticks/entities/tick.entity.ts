import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Stock } from '../../stocks/entities/stock.entity';

export enum TickInterval {
  ONE_MINUTE = '1min',
  FIVE_MINUTES = '5min',
  FIFTEEN_MINUTES = '15min',
  THIRTY_MINUTES = '30min',
  ONE_HOUR = '1hour',
  ONE_DAY = '1day',
}

@Entity('ticks')
export class Tick {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Stock, (stock) => stock.ticks)
  @JoinColumn({ name: 'stockId' })
  stock: Stock;

  @Column()
  stockId: string;

  @Column('decimal', { precision: 10, scale: 4 })
  price: number;

  @Column('decimal', { precision: 15, scale: 2 })
  volume: number;

  @Column()
  timestamp: Date;

  @Column({
    type: 'enum',
    enum: TickInterval,
  })
  interval: TickInterval;

  @CreateDateColumn()
  createdAt: Date;
}