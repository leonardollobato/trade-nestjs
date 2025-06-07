# WebSocket Implementation Structure

This document outlines the file structure and key components for the WebSocket implementation.

## Core Files to Create

### WebSocket Module
```typescript
// src/websocket/websocket.module.ts
import { Module } from '@nestjs/common';
import { WebSocketGateway } from './websocket.gateway';
import { WebSocketService } from './websocket.service';

@Module({
  providers: [WebSocketGateway, WebSocketService],
  exports: [WebSocketService],
})
export class WebSocketModule {}
```

### WebSocket Gateway
```typescript
// src/websocket/websocket.gateway.ts
import { 
  WebSocketGateway as NestWebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketService } from './websocket.service';
import { WebSocketMessageDto } from './dto/websocket-message.dto';

@NestWebSocketGateway({
  cors: {
    origin: '*', // Configure based on environment
  },
})
export class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(private readonly webSocketService: WebSocketService) {}

  afterInit(server: Server) {
    // Initialize WebSocket server
  }

  handleConnection(client: Socket, ...args: any[]) {
    // Handle client connection
  }

  handleDisconnect(client: Socket) {
    // Handle client disconnect
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: WebSocketMessageDto) {
    // Handle incoming messages
  }
}
```

### WebSocket Service
```typescript
// src/websocket/websocket.service.ts
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class WebSocketService {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  broadcastMessage(event: string, data: any, room?: string) {
    // Broadcast message to all clients or specific room
  }

  sendToClient(clientId: string, event: string, data: any) {
    // Send message to specific client
  }

  createRoom(roomName: string) {
    // Create a new room
  }

  joinRoom(clientId: string, roomName: string) {
    // Add client to room
  }

  leaveRoom(clientId: string, roomName: string) {
    // Remove client from room
  }
}
```

### WebSocket Message DTO
```typescript
// src/websocket/dto/websocket-message.dto.ts
export class WebSocketMessageDto {
  event: string;
  data: any;
}
```

## Authentication Components

### WebSocket JWT Auth Guard
```typescript
// src/websocket/guards/ws-jwt-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Validate JWT token for WebSocket connection
  }

  private extractTokenFromHeader(socket: Socket): string | undefined {
    // Extract token from headers
  }
}
```

### WebSocket Auth Middleware
```typescript
// src/websocket/middleware/ws-auth.middleware.ts
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

export interface AuthenticatedSocket extends Socket {
  user: any;
}

export const wsAuthMiddleware = (jwtService: JwtService) => {
  return (socket: Socket, next: (err?: Error) => void) => {
    // Authenticate socket connection
  };
};
```

### Current User Decorator
```typescript
// src/websocket/decorators/ws-current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedSocket } from '../middleware/ws-auth.middleware';

export const WsCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Extract user from WebSocket context
  },
);
```

## Subscription Management

### Subscription Manager Service
```typescript
// src/websocket/services/subscription-manager.service.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SubscriptionDto } from '../dto/subscription.dto';

@Injectable()
export class SubscriptionManagerService {
  private subscriptions: Map<string, Set<string>> = new Map();

  addSubscription(userId: string, stockId: string) {
    // Add subscription
  }

  removeSubscription(userId: string, stockId: string) {
    // Remove subscription
  }

  getSubscriptionsByUser(userId: string): string[] {
    // Get all stocks subscribed by user
  }

  getUsersByStock(stockId: string): string[] {
    // Get all users subscribed to stock
  }

  validateSubscription(subscription: SubscriptionDto): boolean {
    // Validate subscription request
  }

  persistSubscription(userId: string, stockId: string, interval: string) {
    // Save subscription to database
  }
}
```

### Subscription DTOs
```typescript
// src/websocket/dto/subscription.dto.ts
export class SubscriptionDto {
  stockIds: string[];
  interval: string;
}

// src/websocket/dto/subscription-response.dto.ts
export class SubscriptionResponseDto {
  subscribed: string[];
  unsubscribed: string[];
  message: string;
}
```

## Real-time Broadcasting

### Tick Broadcaster Service
```typescript
// src/websocket/services/tick-broadcaster.service.ts
import { Injectable } from '@nestjs/common';
import { WebSocketService } from '../websocket.service';
import { SubscriptionManagerService } from './subscription-manager.service';
import { TickUpdateDto } from '../dto/tick-update.dto';

@Injectable()
export class TickBroadcasterService {
  constructor(
    private readonly webSocketService: WebSocketService,
    private readonly subscriptionManager: SubscriptionManagerService,
  ) {}

  broadcastTickUpdate(tickUpdate: TickUpdateDto) {
    // Broadcast tick update to subscribed users
  }

  formatTickData(tick: any): TickUpdateDto {
    // Format tick data for WebSocket transmission
  }

  optimizeBroadcast(updates: TickUpdateDto[]) {
    // Optimize broadcasting for performance
  }
}
```

### Tick Update DTO
```typescript
// src/websocket/dto/tick-update.dto.ts
export class TickUpdateDto {
  stockId: string;
  symbol: string;
  price: number;
  volume: number;
  timestamp: Date;
  interval: string;
}
```

## Connection Management

### Connection Manager Service
```typescript
// src/websocket/services/connection-manager.service.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ConnectionStatusDto } from '../dto/connection-status.dto';

@Injectable()
export class ConnectionManagerService {
  private connections: Map<string, { socket: Socket; userId: string }> = new Map();

  addConnection(socket: Socket, userId: string) {
    // Track new connection
  }

  removeConnection(socketId: string) {
    // Remove connection on disconnect
  }

  getConnectionsByUser(userId: string): string[] {
    // Get all connections for user
  }

  getConnectionStatus(): ConnectionStatusDto[] {
    // Get status of all connections
  }

  monitorConnectionHealth() {
    // Monitor connection health
  }
}
```

### Connection Status DTO
```typescript
// src/websocket/dto/connection-status.dto.ts
export class ConnectionStatusDto {
  connectionId: string;
  userId: string;
  connected: boolean;
  connectedAt: Date;
  lastActivity: Date;
  ip: string;
}
```

## Admin Controller
```typescript
// src/websocket/controllers/websocket-admin.controller.ts
import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ConnectionManagerService } from '../services/connection-manager.service';
import { ConnectionStatusDto } from '../dto/connection-status.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('admin/websocket')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class WebSocketAdminController {
  constructor(private readonly connectionManager: ConnectionManagerService) {}

  @Get('connections')
  getConnections(): ConnectionStatusDto[] {
    // Get all connections
  }

  @Delete('connections/:id')
  closeConnection(@Param('id') id: string) {
    // Force close a connection
  }
}
```

This structure will be implemented once the necessary dependencies are completed by Agent 1 and Agent 2.