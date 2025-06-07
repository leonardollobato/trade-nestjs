export interface BaseRepositoryInterface<T, CreateDto, UpdateDto, FilterDto = any> {
  create(createDto: CreateDto): Promise<T>;
  findAll(filterDto?: FilterDto): Promise<T[]>;
  findOne(id: string): Promise<T>;
  update(id: string, updateDto: UpdateDto): Promise<T>;
  remove(id: string): Promise<void>;
  count(filterDto?: FilterDto): Promise<number>;
}

export enum DatabaseType {
  SQL = 'sql',
  MONGODB = 'mongodb',
}

export interface RepositoryOptions {
  databaseType?: DatabaseType;
  pagination?: {
    page?: number;
    limit?: number;
  };
  caching?: {
    enabled?: boolean;
    ttl?: number;
  };
  logging?: boolean;
}