export interface Message {
  id: number;
  to: number;
  from: number;
  content: string;
  sent: boolean;
  recieved: boolean;
  read: boolean;
}

export interface Data {
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

export interface ChatUser {
  id: number;
  messages: Message[];
}

export interface LobbyType {
  id: string;
  users: {
    id: number;
    leader: boolean;
  }[];
}
