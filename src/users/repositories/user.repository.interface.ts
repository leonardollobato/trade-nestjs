// This is a placeholder pending completion of AS-1 (User entity) by Agent 1

export interface UserRepositoryInterface {
  create(createUserDto: any): Promise<any>;
  findAll(filterDto?: any): Promise<any[]>;
  findOne(id: string): Promise<any>;
  findOneByEmail(email: string): Promise<any>;
  update(id: string, updateUserDto: any): Promise<any>;
  remove(id: string): Promise<void>;
  
  // User subscriptions
  addSubscription(userId: string, stockId: string, interval: string): Promise<any>;
  removeSubscription(userId: string, subscriptionId: string): Promise<void>;
  findSubscriptions(userId: string): Promise<any[]>;
  
  // Advanced queries
  findByRole(role: string): Promise<any[]>;
  findActive(): Promise<any[]>;
  findInactive(): Promise<any[]>;
  searchByName(query: string): Promise<any[]>;
  
  // Stats
  countByRole(): Promise<{ role: string; count: number }[]>;
  countActive(): Promise<number>;
}