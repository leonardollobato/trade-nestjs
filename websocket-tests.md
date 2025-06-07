# WebSocket Testing Strategy

This document outlines the testing approach for the WebSocket implementation in the Trading Dashboard Backend.

## Unit Tests

### WebSocket Gateway Tests

```typescript
// test/unit/websocket/websocket.gateway.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { WebSocketGateway } from '../../../src/websocket/websocket.gateway';
import { WebSocketService } from '../../../src/websocket/websocket.service';
import { createMock } from '@golevelup/ts-jest';
import { Socket, Server } from 'socket.io';

describe('WebSocketGateway', () => {
  let gateway: WebSocketGateway;
  let webSocketService: WebSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebSocketGateway,
        {
          provide: WebSocketService,
          useValue: createMock<WebSocketService>(),
        },
      ],
    }).compile();

    gateway = module.get<WebSocketGateway>(WebSocketGateway);
    webSocketService = module.get<WebSocketService>(WebSocketService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('afterInit', () => {
    it('should set the server in WebSocketService', () => {
      const server = createMock<Server>();
      gateway.afterInit(server);
      expect(webSocketService.setServer).toHaveBeenCalledWith(server);
    });
  });

  describe('handleConnection', () => {
    it('should handle new client connections', () => {
      const client = createMock<Socket>();
      gateway.handleConnection(client);
      // Test connection handling
    });
  });

  describe('handleDisconnect', () => {
    it('should handle client disconnections', () => {
      const client = createMock<Socket>();
      gateway.handleDisconnect(client);
      // Test disconnect handling
    });
  });

  describe('handleMessage', () => {
    it('should handle incoming messages', () => {
      const client = createMock<Socket>();
      const payload = { event: 'test', data: {} };
      gateway.handleMessage(client, payload);
      // Test message handling
    });
  });
});
```

### WebSocket Service Tests

```typescript
// test/unit/websocket/websocket.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { WebSocketService } from '../../../src/websocket/websocket.service';
import { createMock } from '@golevelup/ts-jest';
import { Server } from 'socket.io';

describe('WebSocketService', () => {
  let service: WebSocketService;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebSocketService],
    }).compile();

    service = module.get<WebSocketService>(WebSocketService);
    server = createMock<Server>();
    service.setServer(server);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('broadcastMessage', () => {
    it('should broadcast message to all clients', () => {
      const event = 'testEvent';
      const data = { test: 'data' };
      service.broadcastMessage(event, data);
      expect(server.emit).toHaveBeenCalledWith(event, data);
    });

    it('should broadcast message to a specific room', () => {
      const event = 'testEvent';
      const data = { test: 'data' };
      const room = 'testRoom';
      service.broadcastMessage(event, data, room);
      expect(server.to).toHaveBeenCalledWith(room);
      expect(server.to(room).emit).toHaveBeenCalledWith(event, data);
    });
  });

  // Additional methods tests
});
```

### JWT Auth Guard Tests

```typescript
// test/unit/websocket/guards/ws-jwt-auth.guard.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { WsJwtAuthGuard } from '../../../../src/websocket/guards/ws-jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

describe('WsJwtAuthGuard', () => {
  let guard: WsJwtAuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WsJwtAuthGuard,
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
      ],
    }).compile();

    guard = module.get<WsJwtAuthGuard>(WsJwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true for valid token', async () => {
      const mockContext = createMock<ExecutionContext>();
      const mockSocket = {
        handshake: {
          headers: {
            authorization: 'Bearer valid-token',
          },
        },
      };

      mockContext.switchToWs.mockReturnValue({
        getClient: () => mockSocket,
      });

      jwtService.verifyAsync.mockResolvedValue({ sub: 'user-id' });

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should throw WsException for invalid token', async () => {
      const mockContext = createMock<ExecutionContext>();
      const mockSocket = {
        handshake: {
          headers: {
            authorization: 'Bearer invalid-token',
          },
        },
      };

      mockContext.switchToWs.mockReturnValue({
        getClient: () => mockSocket,
      });

      jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(guard.canActivate(mockContext)).rejects.toThrow(WsException);
    });
  });
});
```

### Subscription Manager Tests

```typescript
// test/unit/websocket/services/subscription-manager.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionManagerService } from '../../../../src/websocket/services/subscription-manager.service';
import { SubscriptionDto } from '../../../../src/websocket/dto/subscription.dto';

describe('SubscriptionManagerService', () => {
  let service: SubscriptionManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionManagerService],
    }).compile();

    service = module.get<SubscriptionManagerService>(SubscriptionManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addSubscription', () => {
    it('should add a subscription for a user', () => {
      const userId = 'user1';
      const stockId = 'stock1';
      service.addSubscription(userId, stockId);
      const userSubscriptions = service.getSubscriptionsByUser(userId);
      expect(userSubscriptions).toContain(stockId);
    });
  });

  describe('removeSubscription', () => {
    it('should remove a subscription for a user', () => {
      const userId = 'user1';
      const stockId = 'stock1';
      service.addSubscription(userId, stockId);
      service.removeSubscription(userId, stockId);
      const userSubscriptions = service.getSubscriptionsByUser(userId);
      expect(userSubscriptions).not.toContain(stockId);
    });
  });

  describe('validateSubscription', () => {
    it('should validate a valid subscription', () => {
      const subscription: SubscriptionDto = {
        stockIds: ['stock1', 'stock2'],
        interval: '5min',
      };
      const isValid = service.validateSubscription(subscription);
      expect(isValid).toBe(true);
    });

    it('should reject an invalid subscription', () => {
      const subscription: SubscriptionDto = {
        stockIds: [],
        interval: 'invalid',
      };
      const isValid = service.validateSubscription(subscription);
      expect(isValid).toBe(false);
    });
  });

  // Additional methods tests
});
```

## Integration Tests

### WebSocket Authentication Integration Test

```typescript
// test/integration/websocket/websocket-auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AppModule } from '../../../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { createUser, authenticateUser } from '../../helpers/auth-helper';

describe('WebSocket Authentication (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let clientSocket: Socket;
  let validToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
    await app.listen(3000);

    // Create test user and get valid token
    const user = await createUser(app);
    validToken = await authenticateUser(app, user.email, 'password');
  });

  afterAll(async () => {
    if (clientSocket) {
      clientSocket.close();
    }
    await app.close();
  });

  it('should connect with valid JWT token', (done) => {
    clientSocket = io('http://localhost:3000', {
      extraHeaders: {
        authorization: `Bearer ${validToken}`,
      },
    });

    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });

    clientSocket.on('connect_error', (err) => {
      done.fail(err);
    });
  });

  it('should reject connection with invalid JWT token', (done) => {
    const socketWithInvalidToken = io('http://localhost:3000', {
      extraHeaders: {
        authorization: 'Bearer invalid-token',
      },
    });

    socketWithInvalidToken.on('connect_error', (err) => {
      expect(err).toBeDefined();
      socketWithInvalidToken.close();
      done();
    });

    socketWithInvalidToken.on('connect', () => {
      socketWithInvalidToken.close();
      done.fail('Should not connect with invalid token');
    });
  });
});
```

### Real-time Subscription Integration Test

```typescript
// test/integration/websocket/subscription.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AppModule } from '../../../src/app.module';
import { createUser, authenticateUser } from '../../helpers/auth-helper';
import { createStock } from '../../helpers/stock-helper';

describe('WebSocket Subscription (e2e)', () => {
  let app: INestApplication;
  let clientSocket: Socket;
  let validToken: string;
  let stockId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3000);

    // Create test user and get valid token
    const user = await createUser(app);
    validToken = await authenticateUser(app, user.email, 'password');

    // Create test stock
    const stock = await createStock(app, validToken);
    stockId = stock.id;
  });

  beforeEach((done) => {
    clientSocket = io('http://localhost:3000', {
      extraHeaders: {
        authorization: `Bearer ${validToken}`,
      },
    });

    clientSocket.on('connect', () => {
      done();
    });
  });

  afterEach(() => {
    if (clientSocket) {
      clientSocket.close();
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('should subscribe to stock updates', (done) => {
    clientSocket.emit('subscribe', {
      stockIds: [stockId],
      interval: '5min',
    });

    clientSocket.on('subscription-update', (data) => {
      expect(data.subscribed).toContain(stockId);
      done();
    });
  });

  it('should unsubscribe from stock updates', (done) => {
    // First subscribe
    clientSocket.emit('subscribe', {
      stockIds: [stockId],
      interval: '5min',
    });

    clientSocket.on('subscription-update', (data) => {
      if (data.subscribed && data.subscribed.includes(stockId)) {
        // Then unsubscribe
        clientSocket.emit('unsubscribe', {
          stockIds: [stockId],
        });
      } else if (data.unsubscribed && data.unsubscribed.includes(stockId)) {
        done();
      }
    });
  });
});
```

### Real-time Tick Broadcasting Integration Test

```typescript
// test/integration/websocket/tick-broadcast.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AppModule } from '../../../src/app.module';
import { createUser, authenticateUser } from '../../helpers/auth-helper';
import { createStock } from '../../helpers/stock-helper';
import { TickGeneratorService } from '../../../src/ticks/generators/tick-generator.service';

describe('WebSocket Tick Broadcasting (e2e)', () => {
  let app: INestApplication;
  let clientSocket: Socket;
  let validToken: string;
  let stockId: string;
  let tickGeneratorService: TickGeneratorService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    tickGeneratorService = moduleFixture.get<TickGeneratorService>(TickGeneratorService);
    await app.init();
    await app.listen(3000);

    // Create test user and get valid token
    const user = await createUser(app);
    validToken = await authenticateUser(app, user.email, 'password');

    // Create test stock
    const stock = await createStock(app, validToken);
    stockId = stock.id;
  });

  beforeEach((done) => {
    clientSocket = io('http://localhost:3000', {
      extraHeaders: {
        authorization: `Bearer ${validToken}`,
      },
    });

    clientSocket.on('connect', () => {
      done();
    });
  });

  afterEach(() => {
    if (clientSocket) {
      clientSocket.close();
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('should receive tick updates after subscribing', (done) => {
    // Subscribe to stock
    clientSocket.emit('subscribe', {
      stockIds: [stockId],
      interval: '5min',
    });

    // Generate test tick
    tickGeneratorService.generateTick(stockId);

    // Listen for tick updates
    clientSocket.on('tick-update', (data) => {
      expect(data.stockId).toBe(stockId);
      expect(data.price).toBeDefined();
      expect(data.volume).toBeDefined();
      expect(data.timestamp).toBeDefined();
      done();
    });
  });

  it('should not receive tick updates after unsubscribing', (done) => {
    let receivedInitialUpdate = false;
    let receivedUpdateAfterUnsubscribe = false;

    // Subscribe to stock
    clientSocket.emit('subscribe', {
      stockIds: [stockId],
      interval: '5min',
    });

    // Listen for subscription confirmation
    clientSocket.on('subscription-update', (data) => {
      if (data.subscribed && data.subscribed.includes(stockId)) {
        // Generate test tick after subscribing
        tickGeneratorService.generateTick(stockId);
      }
    });

    // Listen for tick updates
    clientSocket.on('tick-update', (data) => {
      if (!receivedInitialUpdate) {
        receivedInitialUpdate = true;
        
        // Unsubscribe after receiving first update
        clientSocket.emit('unsubscribe', {
          stockIds: [stockId],
        });
        
        // Generate another tick after unsubscribing
        setTimeout(() => {
          tickGeneratorService.generateTick(stockId);
          
          // Wait to see if we receive this update (we shouldn't)
          setTimeout(() => {
            expect(receivedUpdateAfterUnsubscribe).toBe(false);
            done();
          }, 1000);
        }, 1000);
      } else {
        receivedUpdateAfterUnsubscribe = true;
      }
    });
  });
});
```

## Performance Tests

### WebSocket Connection Load Test

```typescript
// test/performance/websocket/connection-load.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AppModule } from '../../../src/app.module';
import { createUser, authenticateUser } from '../../helpers/auth-helper';

describe('WebSocket Connection Load Test', () => {
  let app: INestApplication;
  let validToken: string;
  const sockets: Socket[] = [];
  const CONNECTION_COUNT = 100; // Test with 100 concurrent connections

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3000);

    // Create test user and get valid token
    const user = await createUser(app);
    validToken = await authenticateUser(app, user.email, 'password');
  });

  afterAll(async () => {
    // Close all socket connections
    sockets.forEach((socket) => {
      if (socket.connected) {
        socket.close();
      }
    });
    await app.close();
  });

  it(`should handle ${CONNECTION_COUNT} concurrent connections`, async () => {
    // Create array of connection promises
    const connectionPromises = Array.from({ length: CONNECTION_COUNT }).map((_, i) => {
      return new Promise<void>((resolve, reject) => {
        const socket = io('http://localhost:3000', {
          extraHeaders: {
            authorization: `Bearer ${validToken}`,
          },
        });

        socket.on('connect', () => {
          sockets.push(socket);
          resolve();
        });

        socket.on('connect_error', (err) => {
          reject(err);
        });

        // Set timeout to prevent hanging test
        setTimeout(() => {
          reject(new Error(`Connection timed out for socket ${i}`));
        }, 5000);
      });
    });

    // Wait for all connections to be established
    await Promise.all(connectionPromises);
    
    // Verify all connections are active
    expect(sockets.length).toBe(CONNECTION_COUNT);
    expect(sockets.every((socket) => socket.connected)).toBe(true);
  }, 30000); // Increase timeout for this test
});
```

### Tick Broadcasting Performance Test

```typescript
// test/performance/websocket/broadcasting-performance.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AppModule } from '../../../src/app.module';
import { createUser, authenticateUser } from '../../helpers/auth-helper';
import { createStock } from '../../helpers/stock-helper';
import { TickGeneratorService } from '../../../src/ticks/generators/tick-generator.service';
import { performance } from 'perf_hooks';

describe('WebSocket Broadcasting Performance Test', () => {
  let app: INestApplication;
  let validToken: string;
  let stockId: string;
  let tickGeneratorService: TickGeneratorService;
  const sockets: Socket[] = [];
  const SOCKET_COUNT = 50; // Test with 50 concurrent clients

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    tickGeneratorService = moduleFixture.get<TickGeneratorService>(TickGeneratorService);
    await app.init();
    await app.listen(3000);

    // Create test user and get valid token
    const user = await createUser(app);
    validToken = await authenticateUser(app, user.email, 'password');

    // Create test stock
    const stock = await createStock(app, validToken);
    stockId = stock.id;
  });

  afterAll(async () => {
    // Close all socket connections
    sockets.forEach((socket) => {
      if (socket.connected) {
        socket.close();
      }
    });
    await app.close();
  });

  it(`should broadcast tick updates to ${SOCKET_COUNT} clients with <100ms latency`, async () => {
    // Create and connect sockets
    const connectionPromises = Array.from({ length: SOCKET_COUNT }).map(() => {
      return new Promise<Socket>((resolve) => {
        const socket = io('http://localhost:3000', {
          extraHeaders: {
            authorization: `Bearer ${validToken}`,
          },
        });

        socket.on('connect', () => {
          sockets.push(socket);
          resolve(socket);
        });
      });
    });

    const connectedSockets = await Promise.all(connectionPromises);
    
    // Subscribe all sockets to the stock
    const subscriptionPromises = connectedSockets.map((socket) => {
      return new Promise<void>((resolve) => {
        socket.emit('subscribe', {
          stockIds: [stockId],
          interval: '5min',
        });
        
        socket.on('subscription-update', (data) => {
          if (data.subscribed && data.subscribed.includes(stockId)) {
            resolve();
          }
        });
      });
    });

    await Promise.all(subscriptionPromises);
    
    // Prepare to measure broadcast latency
    const startTime = performance.now();
    const receiveTimes: number[] = [];
    
    const receivePromises = connectedSockets.map((socket) => {
      return new Promise<void>((resolve) => {
        socket.on('tick-update', () => {
          receiveTimes.push(performance.now());
          resolve();
        });
      });
    });
    
    // Generate tick to broadcast
    tickGeneratorService.generateTick(stockId);
    
    // Wait for all clients to receive the update
    await Promise.all(receivePromises);
    
    // Calculate latencies
    const latencies = receiveTimes.map(time => time - startTime);
    const maxLatency = Math.max(...latencies);
    const avgLatency = latencies.reduce((sum, latency) => sum + latency, 0) / latencies.length;
    
    console.log(`Max latency: ${maxLatency.toFixed(2)}ms`);
    console.log(`Average latency: ${avgLatency.toFixed(2)}ms`);
    
    // Assert latency requirements
    expect(maxLatency).toBeLessThan(100);
  }, 30000); // Increase timeout for this test
});
```

These test templates will be implemented and refined once the core WebSocket implementation is complete.