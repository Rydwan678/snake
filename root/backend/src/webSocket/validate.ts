import { Store } from "../interfaces";
import * as send from "./app/protocols/send";

export function ifUserDisconnected(store: Store) {
  const time = Date.now();

  store.users.forEach((user, index) => {
    if (store.users[index] && time - user.lastPing > 5000) {
      console.log("User", store.users[index].id, "disconnected");
      store.users.splice(index, 1);
      send.usersForEveryone(store);
    }
  });
}
