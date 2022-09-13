import { Store } from "../../../interfaces";

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
