import { Store } from "../../../interfaces";
import * as send from "./send";
import WebSocket from "ws";

export function connect(store: Store, userID: number, ws: WebSocket.WebSocket) {
  if (userID && store.users.every((user) => user.id !== userID) === true) {
    store.users.push({
      id: userID,
      ws: ws,
      lastPing: Date.now(),
      lobby: null,
      invites: null,
    });

    send.usersForEveryone(store);
    send.lobbies(store, userID);

    console.log("User", userID, "connected");
    console.log(
      "users: ",
      store.users.map((user) => user.id)
    );
  } else {
    store.users[store.users.findIndex((user) => user.id === userID)].ws = ws;
    send.users(store, userID);
    send.lobbies(store, userID);
  }
}

export function reconnect(
  store: Store,
  userID: number,
  ws: WebSocket.WebSocket
) {
  if (userID) {
    store.users[store.users.findIndex((user) => user.id === userID)].ws = ws;
    send.usersForEveryone(store);
    send.lobbies(store, userID);

    console.log("User", userID, "reconnected");
    console.log("Connected users: ", store.users.length);
    console.log(
      "users: ",
      store.users.map((user) => user.id)
    );
  }
}

export function ping(store: Store, userID: number, ws: WebSocket.WebSocket) {
  const user = store.users.findIndex((user) => user.id === userID);

  if (store.users[user]) {
    store.users[user].lastPing = Date.now();
  } else {
    connect(store, userID, ws);
  }
}
