import WebSocket from "ws";
import { Store, Packet } from "../../interfaces";
// import * as send from "./protocols/send";
import * as parse from "./protocols/parse";

export default function multiplayer(
  packet: Packet,
  store: Store,
  ws: WebSocket.WebSocket,
  userID: number
) {
  if (packet.packetId === "createLobby") {
    userID && parse.createLobby(store, userID);
  }
}
