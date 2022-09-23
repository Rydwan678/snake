import WebSocket from "ws";
import { Store, Packet } from "../interfaces";
import authorization from "./authorization";
import * as validate from "./validate";
import chat from "./chat";
import multiplayer from "./multiplayer";
import app from "./app";
import * as send from "./app/protocols/send";

export function load(store: Store) {
  store.wsServer = new WebSocket.Server({ server: store.server });

  store.wsServer.on("connection", async (ws) => {
    await ws.on("message", (res) => {
      const packet: Packet = JSON.parse(res.toString());
      const userID = authorization(packet.data.userToken);
      if (packet.module === "app") {
        userID && app(packet, store, ws, userID);
      }

      if (packet.module === "chat") {
        userID && chat(packet, store, ws, userID);
      }

      if (packet.module === "multiplayer") {
        userID && multiplayer(packet, store, ws, userID);
      }
    });
    send.usersForEveryone(store);
    send.lobbiesForEveryone(store);
  });

  store.wsServer.on("close", () => {
    console.log("close");
  });

  store.wsServer.on("message", () => {
    console.log("message");
  });

  setInterval(() => {
    if (store.users.length > 0) {
      validate.ifUserDisconnected(store);
    }
  }, 500);
}
