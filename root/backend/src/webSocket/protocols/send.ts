import { Store } from "../../interfaces";

export function users(store: Store, userID: number) {
  const user = store.users.find((user) => user.id === userID);

  user?.ws.send(
    JSON.stringify({
      packetId: "getUsers",
      data: { users: store.users.map((user) => user.id) },
    })
  );
}

export function usersForEveryone(store: Store) {
  console.log("send users for everyone");

  store.users.forEach((user) =>
    user?.ws.send(
      JSON.stringify({
        packetId: "getUsers",
        data: { users: store.users.map((user) => user.id) },
      })
    )
  );
}

export function message(
  store: Store,
  userID: number,
  receiverID: number,
  content: string,
  messageID: number
) {
  const receiver = store.users.findIndex((user) => user.id === receiverID);
  store.users[receiver].ws.send(
    JSON.stringify({
      packetId: "message",
      data: {
        message: {
          from: userID,
          content: content,
          id: messageID,
        },
      },
    })
  );

  sentInfo(store, userID, messageID);
}

export function sentInfo(store: Store, to: number, messageID: number) {
  store.users[store.users.findIndex((user) => user.id === to)].ws.send(
    JSON.stringify({
      packetId: "messageInfo",
      data: {
        messageInfo: {
          info: "sent",
          messageId: messageID,
          to: to,
        },
      },
    })
  );
}

export function readInfo(store: Store, to: number, from: number) {
  store.users[store.users.findIndex((user) => user.id === to)].ws.send(
    JSON.stringify({
      packetId: "messageInfo",
      data: {
        messageInfo: {
          info: "read",
          to: from,
        },
      },
    })
  );
}
