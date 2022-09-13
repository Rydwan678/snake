import { nanoid } from "nanoid";
import { Store } from "../../../interfaces";

export function createLobby(store: Store, userID: number) {
  store.lobbies.push({
    id: nanoid(),
    users: [{ id: userID, leader: true }],
  });
}
