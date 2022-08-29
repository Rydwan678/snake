import { Express } from "express";
import { Server } from "http";
import WebSocket from "Ws";

interface User {
  id: number;
  ws: WebSocket.WebSocket;
  lastPing: number;
}

export interface Store {
  app?: Express;
  server?: Server;
  wsServer?: WebSocket.Server;
  users: User[];
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
  packetId:
    | "connect"
    | "reconnect"
    | "message"
    | "ping"
    | "getUsers"
    | "messageInfo";
  data: Data;
}
