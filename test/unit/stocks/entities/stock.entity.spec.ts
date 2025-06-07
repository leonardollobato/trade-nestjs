import { Stock, StockSector, StockIndex } from '../../../../src/stocks/entities/stock.entity';

describe('Stock Entity', () => {
  it('should create a valid stock instance', () => {
    const stock = new Stock();
    stock.id = '1234';
    stock.symbol = 'AAPL';
    stock.companyName = 'Apple Inc.';
    stock.sector = StockSector.TECHNOLOGY;
    stock.index = StockIndex.NASDAQ;
    stock.marketCap = 2800000000000;
    stock.volumeAverage = 57000000;
    stock.currentPrice = 175.5;
    stock.isActive = true;
    stock.createdAt = new Date();
    stock.updatedAt = new Date();

    expect(stock).toBeDefined();
    expect(stock.id).toBe('1234');
    expect(stock.symbol).toBe('AAPL');
    expect(stock.companyName).toBe('Apple Inc.');
    expect(stock.sector).toBe(StockSector.TECHNOLOGY);
    expect(stock.index).toBe(StockIndex.NASDAQ);
    expect(stock.marketCap).toBe(2800000000000);
    expect(stock.volumeAverage).toBe(57000000);
    expect(stock.currentPrice).toBe(175.5);
    expect(stock.isActive).toBe(true);
    expect(stock.createdAt).toBeInstanceOf(Date);
    expect(stock.updatedAt).toBeInstanceOf(Date);
  });

  it('should validate enum values for sector', () => {
    const validSectors = Object.values(StockSector);
    expect(validSectors).toContain(StockSector.TECHNOLOGY);
    expect(validSectors).toContain(StockSector.FINANCE);
    expect(validSectors).toContain(StockSector.HEALTHCARE);
    expect(validSectors).toContain(StockSector.CONSUMER);
    expect(validSectors).toContain(StockSector.ENERGY);
    expect(validSectors).not.toContain('InvalidSector');
  });

  it('should validate enum values for index', () => {
    const validIndices = Object.values(StockIndex);
    expect(validIndices).toContain(StockIndex.SP500);
    expect(validIndices).toContain(StockIndex.NASDAQ);
    expect(validIndices).toContain(StockIndex.DOW_JONES);
    expect(validIndices).not.toContain('InvalidIndex');
  });
});