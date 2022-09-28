import WebSocket from "ws";
import { Store, Packet } from "../../interfaces";
import * as parse from "./protocols/parse";
import * as send from "./protocols/send";
import { lobbies } from "../app/protocols/send";

export default function game(
  packet: Packet,
  store: Store,
  ws: WebSocket.WebSocket,
  userID: number
) {
  if (packet.packetId === "lobby") {
    if (packet.data.lobby.action === "create") {
      userID && parse.createLobby(store, userID);
    } else if (packet.data.lobby.action === "getLobbies") {
      userID && lobbies(store, userID);
    } else if (packet.data.lobby.action === "invite") {
      parse.invite(
        store,
        userID,
        packet.data.lobby.to,
        packet.data.lobby.lobbyID
      );
    } else if (packet.data.lobby.action === "acceptInvite") {
      parse.acceptInvite(store, userID, packet.data.lobby.inviteID);
    } else if (packet.data.lobby.action === "declineInvite") {
      parse.declineInvite(store, userID, packet.data.lobby.inviteID);
    } else if (packet.data.lobby.action === "leave") {
      parse.leave(store, userID);
    } else if (packet.data.lobby.action === "kick") {
      parse.kick(
        store,
        userID,
        packet.data.lobby.lobbyID,
        packet.data.lobby.to
      );
    }
  } else if (packet.packetId === "start") {
    parse.start(store, userID, packet.data.game.lobbyID);
  } else if (packet.packetId === "move") {
    parse.move(store, userID, packet.data.game.id, packet.data.game.to);
  }
}
