import { Express } from "express";
import { Server } from "http";
import WebSocket from "ws";

interface Invite {
  id: string;
  from: number;
  to: number;
  lobbyID: string;
}

interface User {
  id: number;
  ws: WebSocket.WebSocket;
  lastPing: number;
  lobby: string | null;
  invites: Invite[] | null;
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
  games: Game[];
}

export type Direction = "left" | "right" | "up" | "down";

interface Game {
  id: string;
  users: {
    id: number;
    position: [number, number][];
    direction: Direction;
    score: number;
  }[];
  speed: number;
  applePosition: [number, number];
  bricksPosition: [number, number][];
  isRunning: boolean;
  isCounting: boolean;
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
  lobby: {
    action:
      | "create"
      | "getLobbies"
      | "join"
      | "leave"
      | "kick"
      | "invite"
      | "acceptInvite"
      | "declineInvite";
    lobbyID: string;
    inviteID: string;
    to: number;
    from: number;
    lobbies: Lobby[];
  };
  game: {
    id: string;
    data: Game;
    lobbyID: string | null;
    to: Direction;
  };
  userID?: number;
  userToken: string;
  users: number[];
  lobbies: Lobby[];
}

export interface Packet {
  module: "app" | "chat" | "game";
  packetId:
    | "connect"
    | "reconnect"
    | "message"
    | "ping"
    | "getUsers"
    | "messageInfo"
    | "lobby"
    | "start"
    | "move";
  data: Data;
}
