import WebSocket from "ws";
import { Store, Packet } from "../../interfaces";
import * as send from "./protocols/send";
import * as parse from "./protocols/parse";

export default function chat(
  packet: Packet,
  store: Store,
  ws: WebSocket.WebSocket,
  userID: number
) {
  if (packet.packetId === "message") {
    parse.message(store, packet, userID);
  }

  if (packet.packetId === "messageInfo") {
    parse.messageInfo(store, packet, userID);
  }
}
