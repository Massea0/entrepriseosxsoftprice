// 🔄 Real-time WebSocket Manager
// GRAND LEAP TODO - Phase 1.3: Data Layer Revolution

import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

export interface SocketUser {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'employee' | 'client';
  companyId?: string;
  socketId: string;
}

export interface RealTimeEvent {
  type: string;
  data: any;
  userId?: string;
  companyId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class RealTimeManager {
  private io: SocketIOServer;
  private connectedUsers: Map<string, SocketUser> = new Map();
  private userSockets: Map<string, string> = new Map(); // userId -> socketId
  private rooms: Map<string, Set<string>> = new Map(); // roomId -> userIds

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupAuthMiddleware();
    this.setupEventHandlers();
    
    console.log('🔄 Real-time WebSocket Manager initialized');
  }

  /**
   * 🔐 Middleware d'authentification
   */
  private setupAuthMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        
        if (!token) {
          throw new Error('No authentication token provided');
        }

        // Vérification du JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        
        // TODO: Récupérer les données utilisateur depuis la DB
        const user: SocketUser = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          companyId: decoded.companyId,
          socketId: socket.id
        };

        socket.data.user = user;
        next();
      } catch (error) {
        console.error('WebSocket authentication failed:', error);
        next(new Error('Authentication failed'));
      }
    });
  }

  /**
   * 📡 Configuration des gestionnaires d'événements
   */
  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      const user = socket.data.user as SocketUser;
      console.log(`🔗 User connected: ${user.email} (${socket.id})`);

      // Enregistrer l'utilisateur
      this.connectedUsers.set(socket.id, user);
      this.userSockets.set(user.id, socket.id);

      // Joindre les salles par défaut
      this.joinDefaultRooms(socket, user);

      // Gestionnaires d'événements spécifiques
      this.setupUserEventHandlers(socket, user);

      // Déconnexion
      socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${user.email}`);
        this.connectedUsers.delete(socket.id);
        this.userSockets.delete(user.id);
        this.removeFromAllRooms(user.id);
      });
    });
  }

  /**
   * 🏠 Salles par défaut selon le rôle
   */
  private joinDefaultRooms(socket: any, user: SocketUser) {
    // Salle générale de l'entreprise
    if (user.companyId) {
      this.joinRoom(user.id, `company:${user.companyId}`);
      socket.join(`company:${user.companyId}`);
    }

    // Salle par rôle
    this.joinRoom(user.id, `role:${user.role}`);
    socket.join(`role:${user.role}`);

    // Salle personnelle
    this.joinRoom(user.id, `user:${user.id}`);
    socket.join(`user:${user.id}`);

    console.log(`🏠 User ${user.email} joined default rooms`);
  }

  /**
   * 📬 Gestionnaires d'événements utilisateur
   */
  private setupUserEventHandlers(socket: any, user: SocketUser) {
    // Rejoindre une salle spécifique
    socket.on('join-room', (roomId: string) => {
      if (this.canJoinRoom(user, roomId)) {
        socket.join(roomId);
        this.joinRoom(user.id, roomId);
        console.log(`🚪 ${user.email} joined room: ${roomId}`);
      }
    });

    // Quitter une salle
    socket.on('leave-room', (roomId: string) => {
      socket.leave(roomId);
      this.leaveRoom(user.id, roomId);
      console.log(`🚪 ${user.email} left room: ${roomId}`);
    });

    // Message direct
    socket.on('direct-message', (data: { targetUserId: string; message: any }) => {
      this.sendToUser(data.targetUserId, 'direct-message', {
        from: user,
        message: data.message,
        timestamp: new Date()
      });
    });

    // Notification de présence
    socket.on('presence-update', (status: 'online' | 'away' | 'busy' | 'offline') => {
      this.broadcastToCompany(user.companyId, 'user-presence', {
        userId: user.id,
        status,
        timestamp: new Date()
      });
    });

    // Collaboration en temps réel
    socket.on('document-update', (data: any) => {
      this.broadcastToRoom(`document:${data.documentId}`, 'document-updated', {
        ...data,
        userId: user.id,
        timestamp: new Date()
      }, user.id);
    });

    // Curseur collaboratif
    socket.on('cursor-move', (data: any) => {
      this.broadcastToRoom(`document:${data.documentId}`, 'cursor-moved', {
        userId: user.id,
        position: data.position,
        user: { id: user.id, email: user.email }
      }, user.id);
    });
  }

  /**
   * 📤 Envoyer à un utilisateur spécifique
   */
  sendToUser(userId: string, event: string, data: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
      return true;
    }
    return false;
  }

  /**
   * 📢 Diffuser à une salle
   */
  broadcastToRoom(roomId: string, event: string, data: any, excludeUserId?: string) {
    let emitter = this.io.to(roomId);
    
    if (excludeUserId) {
      const excludeSocketId = this.userSockets.get(excludeUserId);
      if (excludeSocketId) {
        emitter = emitter.except(excludeSocketId);
      }
    }
    
    emitter.emit(event, data);
  }

  /**
   * 🏢 Diffuser à toute l'entreprise
   */
  broadcastToCompany(companyId: string | undefined, event: string, data: any) {
    if (companyId) {
      this.broadcastToRoom(`company:${companyId}`, event, data);
    }
  }

  /**
   * 🎯 Diffuser par rôle
   */
  broadcastToRole(role: string, event: string, data: any) {
    this.broadcastToRoom(`role:${role}`, event, data);
  }

  /**
   * 🌐 Diffuser à tous les utilisateurs connectés
   */
  broadcastToAll(event: string, data: any) {
    this.io.emit(event, data);
  }

  /**
   * 🏠 Gestion des salles
   */
  private joinRoom(userId: string, roomId: string) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(userId);
  }

  private leaveRoom(userId: string, roomId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(userId);
      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  private removeFromAllRooms(userId: string) {
    this.rooms.forEach((users, roomId) => {
      users.delete(userId);
      if (users.size === 0) {
        this.rooms.delete(roomId);
      }
    });
  }

  /**
   * 🔐 Vérification des permissions de salle
   */
  private canJoinRoom(user: SocketUser, roomId: string): boolean {
    // Logique de permissions selon le type de salle
    if (roomId.startsWith('admin:') && user.role !== 'admin') {
      return false;
    }
    
    if (roomId.startsWith('company:')) {
      const companyId = roomId.split(':')[1];
      return user.companyId === companyId;
    }
    
    if (roomId.startsWith('project:')) {
      // TODO: Vérifier si l'utilisateur fait partie du projet
      return true;
    }
    
    return true;
  }

  /**
   * 📊 Statistiques en temps réel
   */
  getStats() {
    return {
      connectedUsers: this.connectedUsers.size,
      totalRooms: this.rooms.size,
      usersByRole: this.getUsersByRole(),
      roomsInfo: this.getRoomsInfo()
    };
  }

  private getUsersByRole() {
    const roles: Record<string, number> = {};
    this.connectedUsers.forEach(user => {
      roles[user.role] = (roles[user.role] || 0) + 1;
    });
    return roles;
  }

  private getRoomsInfo() {
    const info: Record<string, number> = {};
    this.rooms.forEach((users, roomId) => {
      info[roomId] = users.size;
    });
    return info;
  }

  /**
   * 💚 Health check
   */
  isHealthy(): boolean {
    return this.io.engine.clientsCount >= 0;
  }
}

export let realTimeManager: RealTimeManager;
