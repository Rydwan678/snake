import WebSocket from "ws";
import { Store, Packet } from "../interfaces";
import authorization from "./authorization";
import * as validate from "./validate";
import chat from "./chat";
import multiplayer from "./multiplayer";
import app from "./app";

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
  });

  store.wsServer.on("close", () => {
    console.log("close");
  });

  store.wsServer.on("message", () => {
    console.log("pisze se");
  });

  setInterval(() => {
    if (store.users.length > 0) {
      validate.ifUserDisconnected(store);
    }
  }, 500);
}
