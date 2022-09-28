import WebSocket from "ws";
import { Store, Packet } from "../interfaces";
import authorization from "./authorization";
import * as validate from "./validate";
import chat from "./chat";
import game from "./game";
import app from "./app";
import * as send from "./app/protocols/send";
import { processGames } from "./game/game";

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
      if (packet.module === "game") {
        userID && game(packet, store, ws, userID);
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

  setInterval(() => {
    processGames(store);
  }, 1000);
}
