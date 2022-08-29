import e from "express";
import WebSocket from "ws";
import { Store, Packet } from "../interfaces";
import authorization from "./authorization";
import * as send from "./protocols/send";

export function load(store: Store) {
  store.wsServer = new WebSocket.Server({ server: store.server });

  store.wsServer.on("connection", async (ws) => {
    await ws.on("message", (res) => {
      const packet: Packet = JSON.parse(res.toString());
      const token = packet.data.userToken;
      const userID = authorization(token);
      const user = store.users.findIndex((user) => user.id === userID);

      if (packet.packetId === "connect") {
        userID && connect(userID, ws);
      }

      if (packet.packetId === "reconnect") {
        userID && reconnect(userID, ws);
      }

      if (packet.packetId === "ping") {
        if (store.users[user]) {
          store.users[user].lastPing = Date.now();
        }
      }

      if (packet.packetId === "message") {
        if (
          packet.data.message &&
          packet.data.message.to &&
          packet.data.message.content &&
          packet.data.message.id &&
          userID
        ) {
          send.message(
            store,
            userID,
            packet.data.message.to,
            packet.data.message.content,
            packet.data.message.id
          );
        }
      }

      if (packet.packetId === "messageInfo" && packet.data.messageInfo) {
        if (packet.data.messageInfo.info === "sent") {
          send.sentInfo(
            store,
            packet.data.messageInfo.to,
            packet.data.messageInfo.messageId
          );
        } else if (packet.data.messageInfo.info === "read" && userID) {
          send.readInfo(store, packet.data.messageInfo.to, userID);
        }
      }
    });
  });

  store.wsServer.on("close", () => {
    console.log("close");
  });

  store.wsServer.on("message", () => {
    console.log("pisze se");
  });

  function connect(userID: number, ws: WebSocket.WebSocket) {
    if (userID && store.users.every((user) => user.id !== userID) === true) {
      store.users.push({ id: userID, ws: ws, lastPing: Date.now() });

      send.usersForEveryone(store);

      console.log("User", userID, "connected");
      console.log("Connected users: ", store.users.length);
      console.log(
        "users: ",
        store.users.map((user) => user.id)
      );
    } else {
      store.users[store.users.findIndex((user) => user.id === userID)].ws = ws;
      send.users(store, userID);
    }
  }

  function reconnect(userID: number, ws: WebSocket.WebSocket) {
    if (userID) {
      store.users[store.users.findIndex((user) => user.id === userID)].ws = ws;
      send.usersForEveryone(store);

      console.log("User", userID, "reconnected");
      console.log("Connected users: ", store.users.length);
      console.log(
        "users: ",
        store.users.map((user) => user.id)
      );
    }
  }

  function checkIfUserDisconnected() {
    const time = Date.now();

    store.users.forEach((user, index) => {
      if (store.users[index] && time - user.lastPing > 5000) {
        console.log("User", store.users[index].id, "disconnected");
        store.users.splice(index, 1);
        send.usersForEveryone(store);
      }
    });
  }

  setInterval(() => {
    if (store.users.length > 0) {
      checkIfUserDisconnected();
    }
  }, 500);
}
