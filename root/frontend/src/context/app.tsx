import React from "react";

import { LobbyType, User, Game } from "../../../shared/interfaces";
import { Settings, Setting, AlertType, Alert } from "../types";

export interface AppContextType {
  users: User[];
  lobbies: LobbyType[];
  me: number | undefined;
  lobby: LobbyType | null;
  recipient: number | undefined;
  settings: Settings;
  game: Game;
  alert: Alert;
  fn: {
    sendMessage: (content: string) => void;
    changeRecipient: (id: number) => void;
    sendReadStatus: () => void;
    changeGamemode: (selectedGamemode: string) => void;
    changeDifficulty: () => void;
    toggleSetting: (setting: Setting) => void;
    connect: () => void;
    createLobby: () => void;
    getLobbies: () => void;
    invite: (lobbyID: string, userID: number) => void;
    acceptInvite: (inviteID: string) => void;
    leaveLobby: () => void;
    kick: (to: number) => void;
    showAlert: (type: AlertType, message: string, inviteID?: string) => void;
    handleAlertClose: () => void;
    startGame: (mode: "singleplayer" | "multiplayer") => void;
    changeDirection: (e: React.KeyboardEvent) => void;
  };
}

export const AppContext = React.createContext<AppContextType | {}>({});
