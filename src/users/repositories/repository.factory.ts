import { DatabaseType, RepositoryOptions } from '../../common/repositories/base.repository.interface';
import { UserRepositoryInterface } from './user.repository.interface';

export class RepositoryFactory {
  // This factory will be expanded once the actual repository implementations are created
  // after Agent 1 completes the database setup
  
  static createUserRepository(options: RepositoryOptions = {}): UserRepositoryInterface {
    const { databaseType = DatabaseType.SQL } = options;
    
    // Placeholder - will be implemented once TypeORM and MongoDB repositories are available
    switch (databaseType) {
      case DatabaseType.MONGODB:
        // return new MongooseUserRepository(options);
        throw new Error('MongoDB repository not yet implemented');
      case DatabaseType.SQL:
      default:
        // return new TypeOrmUserRepository(options);
        throw new Error('TypeORM repository not yet implemented');
    }
  }
}

// In the future, we'll add similar factory methods for stocks and ticks
// Example:
// static createStockRepository(options: RepositoryOptions = {}): StockRepositoryInterface