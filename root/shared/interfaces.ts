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
    lobbies: LobbyType[];
  };
  userID?: number;
  userToken: string;
  users: {
    id: number;
    lobby: string | null;
    invites: Invite[] | null;
  }[];
}

export interface Packet {
  packetId:
    | "connect"
    | "reconnect"
    | "message"
    | "ping"
    | "getUsers"
    | "messageInfo"
    | "lobby";
  data: Data;
}

export interface User {
  id: number;
  messages: Message[] | undefined;
  online: boolean;
  lobby: string | null;
  invites: Invite[] | null;
}

export interface LobbyType {
  id: string;
  users: {
    id: number;
    leader: boolean;
  }[];
}

interface Invite {
  id: string;
  from: number;
  to: number;
  lobbyID: string;
}
