import React from "react";

import { LobbyType, User, Game } from "../../../shared/interfaces";
import { Settings, Setting, AlertType, Alert, Popup, Gamemode } from "../types";

export interface AppContextType {
  users: User[];
  lobbies: LobbyType[];
  me: number | undefined;
  lobby: LobbyType | null;
  recipient: number | undefined;
  settings: Settings;
  game: Game;
  alert: Alert;
  popup: Popup;
  fn: {
    sendMessage: (content: string) => void;
    changeRecipient: (id: number) => void;
    sendReadStatus: () => void;
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
    setPopup: React.Dispatch<
      React.SetStateAction<{
        isShown: boolean;
        type: string;
      }>
    >;
    handleAlertClose: () => void;
    startGame: (gamemode: Gamemode) => void;
    pauseGame: () => void;
    leaveGame: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    nextLevel: () => void;
  };
}

export const AppContext = React.createContext<AppContextType | {}>({});
