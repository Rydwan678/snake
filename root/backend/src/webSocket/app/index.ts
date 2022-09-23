import WebSocket from "ws";
import { Store, Packet } from "../../interfaces";
// import * as send from "./protocols/send";
import * as parse from "./protocols/parse";

export default function app(
  packet: Packet,
  store: Store,
  ws: WebSocket.WebSocket,
  userID: number
) {
  if (packet.packetId === "connect") {
    userID && parse.connect(store, userID, ws);
  }

  if (packet.packetId === "reconnect") {
    userID && parse.reconnect(store, userID, ws);
  }

  if (packet.packetId === "ping") {
    userID && parse.ping(store, userID, ws);
  }
}
