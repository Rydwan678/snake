import { Express } from "express";
import { Server } from "http";
import WebSocket from "ws";

export type Gamemode = "classic" | "bricks" | "pvp" | "pve";
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
  mode: Gamemode;
  users: {
    id: number | "env";
    position: [number, number][];
    direction: Direction;
    score: number;
    speed: number;
  }[];

  level: number;
  applePosition: [number, number] | undefined;
  bricksPosition: [number, number][];
  isRunning: boolean;
  isCounting: boolean;
  winner: undefined | number | "env";
  loser: undefined | number | "env";
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
    mode: Gamemode;
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
    | "move"
    | "pause"
    | "leaveGame"
    | "nextLevel";
  data: Data;
}
