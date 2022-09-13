import { Packet, Store } from "../../../interfaces";
import * as send from "./send";

export function message(store: Store, packet: Packet, userID: number) {
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

export function messageInfo(store: Store, packet: Packet, userID: number) {
  if (packet.data.messageInfo) {
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
}
