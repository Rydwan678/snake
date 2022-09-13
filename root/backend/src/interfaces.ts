import { Express } from "express";
import { Server } from "http";
import WebSocket from "ws";

interface User {
  id: number;
  ws: WebSocket.WebSocket;
  lastPing: number;
  lobby: number | undefined;
}

interface Lobby {
  id: string;
  users: {
    id: number;
    leader: boolean;
  }[];
}

export interface Store {
  app?: Express;
  server?: Server;
  wsServer?: WebSocket.Server;
  users: User[];
  lobbies: Lobby[];
  games: [];
}

interface Message {
  to?: number;
  from?: number;
  content: string;
  id: number;
}

interface Data {
  message?: Message;
  messageInfo?: {
    info: "sent" | "read";
    messageId: number;
    to: number;
    from: number;
  };
  userID?: number;
  userToken: string;
  users: number[];
}

export interface Packet {
  module: "app" | "chat" | "multiplayer";
  packetId:
    | "connect"
    | "reconnect"
    | "message"
    | "ping"
    | "getUsers"
    | "messageInfo"
    | "createLobby";
  data: Data;
}
