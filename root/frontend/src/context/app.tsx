import React from "react";

import { Message } from "../../../shared/interfaces";
import { Settings, Setting } from "../types";

export interface AppContextType {
  users: { id: number; messages: Message[] | undefined; online: boolean }[];
  me: number | undefined;
  recipient: number | undefined;
  settings: Settings;
  fn: {
    sendMessage: (content: string) => void;
    changeRecipient: (id: number) => void;
    sendReadStatus: () => void;
    changeGamemode: (selectedGamemode: string) => void;
    changeDifficulty: () => void;
    toggleSetting: (setting: Setting) => void;
    connect: () => void;
  };
}

export const AppContext = React.createContext<AppContextType | {}>({});
